"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PackageData } from "./PackageCard";
import {
  Calendar,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Compass,
  AlertCircle,
  CreditCard,
  Upload,
  QrCode,
  Building2,
  Info,
  Copy,
  Check,
  X,
  Download,
  Maximize2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import CustomSelect from "@/components/ui/CustomSelect";
import ModernDatePicker from "@/components/ui/ModernDatePicker";
import SessionTimePicker from "@/components/ui/SessionTimePicker";
import { formatIdr, formatUsd } from "@/lib/format";

const SESSION_STORAGE_KEY = "gili_snorkeling_active_booking_v1";

interface BookingFormProps {
  packagesList: PackageData[];
  initialSlug?: string;
  whatsappNumber?: string;
  siteSettings?: any[];
}

export default function BookingForm({
  packagesList,
  initialSlug,
  whatsappNumber,
  siteSettings,
}: BookingFormProps) {
  const t = useTranslations("booking");
  const tPkg = useTranslations("packages");
  const tCta = useTranslations("cta");
  const phoneTarget = whatsappNumber || "6282236851307";

  // Wizard Step: 1 = Details Form, 2 = Payment & Proof, 3 = Confirmation & WhatsApp
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form input states
  const [selectedPkgSlug, setSelectedPkgSlug] = useState<string>(
    initialSlug || (packagesList.length > 0 ? packagesList[0].slug : ""),
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [tripDate, setTripDate] = useState("");
  const [tripSession, setTripSession] = useState("morning");
  const [departureTime, setDepartureTime] = useState("09:30 AM");
  const [tripDuration, setTripDuration] = useState("4 - 5 Hours (Standard)");
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer">(
    "qris",
  );

  // Submission & Data states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // UI helpers
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [liveSettings, setLiveSettings] = useState<any[]>(siteSettings || []);
  const [isHydrated, setIsHydrated] = useState(false);

  // Payment proof upload state
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // 1. Hydrate state from sessionStorage on initial client load
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.submittedBooking) setSubmittedBooking(data.submittedBooking);
        if (data.currentStep && [1, 2, 3].includes(data.currentStep)) {
          setCurrentStep(data.currentStep);
        }
        if (data.selectedPkgSlug) setSelectedPkgSlug(data.selectedPkgSlug);
        if (data.customerName) setCustomerName(data.customerName);
        if (data.customerEmail) setCustomerEmail(data.customerEmail);
        if (data.customerPhone) setCustomerPhone(data.customerPhone);
        if (data.numberOfPeople) setNumberOfPeople(data.numberOfPeople);
        if (data.tripDate) setTripDate(data.tripDate);
        if (data.tripSession) setTripSession(data.tripSession);
        if (data.departureTime) setDepartureTime(data.departureTime);
        if (data.tripDuration) setTripDuration(data.tripDuration);
        if (data.pickupLocation) setPickupLocation(data.pickupLocation);
        if (data.specialRequests) setSpecialRequests(data.specialRequests);
        if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
        if (data.paymentProofUrl) setPaymentProofUrl(data.paymentProofUrl);
      }
    } catch (e) {
      console.warn("Could not restore booking session:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist state to sessionStorage whenever relevant fields change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const sessionData = {
        currentStep,
        submittedBooking,
        selectedPkgSlug,
        customerName,
        customerEmail,
        customerPhone,
        numberOfPeople,
        tripDate,
        tripSession,
        departureTime,
        tripDuration,
        pickupLocation,
        specialRequests,
        paymentMethod,
        paymentProofUrl,
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.warn("Could not save booking session:", e);
    }
  }, [
    isHydrated,
    currentStep,
    submittedBooking,
    selectedPkgSlug,
    customerName,
    customerEmail,
    customerPhone,
    numberOfPeople,
    tripDate,
    tripSession,
    departureTime,
    tripDuration,
    pickupLocation,
    specialRequests,
    paymentMethod,
    paymentProofUrl,
  ]);

  // Fetch live settings on mount to ensure fresh payment details & QRIS image
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveSettings(data);
        }
      })
      .catch((e) => console.warn("Could not refresh settings:", e));
  }, []);

  // Helper to get settings
  const getSetting = (key: string, fallback: string = "") => {
    const source =
      liveSettings && liveSettings.length > 0
        ? liveSettings
        : siteSettings || [];
    const found = source.find((s: any) => s.key === key);
    return found?.value !== undefined && found.value !== ""
      ? found.value
      : fallback;
  };

  const qrisActive = getSetting("payment_qris_active", "true") !== "false";
  const qrisName = getSetting(
    "payment_qris_name",
    "Trip Snorkeling Gili Trawangan",
  );
  const qrisImage = getSetting("payment_qris_image", "");

  const bankActive = getSetting("payment_bank_active", "true") !== "false";
  const bankName = getSetting("payment_bank_name", "Bank Central Asia (BCA)");
  const bankNumber = getSetting("payment_bank_number", "8735-0123-4567");
  const bankHolder = getSetting("payment_bank_holder", "Trip Snorkeling Gili");
  const bankNotes = getSetting(
    "payment_bank_notes",
    "Please include your Booking Reference Code in the transfer note.",
  );

  // Current package
  const currentPackage =
    packagesList.find((p) => p.slug === selectedPkgSlug) || packagesList[0];

  const isPrivatePackage = currentPackage
    ? currentPackage.priceUnit === "per_boat" ||
      (!currentPackage.priceUnit && currentPackage.price > 500000)
    : false;

  const packageType: "public" | "private" = isPrivatePackage
    ? "private"
    : "public";
  const PRIVATE_MAX_PAX = 4;

  // Set default tripDate to tomorrow if empty
  useEffect(() => {
    if (!tripDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");
      setTripDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [tripDate]);

  // Compute estimated total based on priceUnit
  const computePrice = () => {
    if (!currentPackage)
      return { idr: 0, usd: 0, boatsCount: 1, isPerBoat: false };
    const isPerBoat = isPrivatePackage;
    if (isPerBoat) {
      return {
        idr: currentPackage.price,
        usd: Number(currentPackage.priceUsd.toFixed(2)),
        boatsCount: 1,
        isPerBoat: true,
      };
    } else {
      return {
        idr: currentPackage.price * numberOfPeople,
        usd: Number((currentPackage.priceUsd * numberOfPeople).toFixed(2)),
        boatsCount: 1,
        isPerBoat: false,
      };
    }
  };

  // Sync duration when package changes
  useEffect(() => {
    if (currentPackage?.durationEn && !tripDuration) {
      setTripDuration(currentPackage.durationEn);
    }
  }, [selectedPkgSlug, currentPackage]);

  const getFormattedSession = () => {
    if (!isPrivatePackage) {
      return tripSession === "morning"
        ? "Morning Session (09:30 AM WITA)"
        : "Afternoon Session (01:00 PM WITA)";
    }
    const sessionLabel =
      tripSession === "morning"
        ? "Morning"
        : tripSession === "afternoon"
          ? "Afternoon"
          : tripSession === "sunset"
            ? "Sunset"
            : "Custom";
    return `${sessionLabel} (Departure: ${departureTime} WITA) • Duration: ${tripDuration}`;
  };

  const totals = computePrice();

  // Scroll to top helper
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  };

  // Reset entire booking session to start fresh
  const handleResetBooking = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setSubmittedBooking(null);
    setCurrentStep(1);
    setPaymentProofUrl("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setPickupLocation("");
    setSpecialRequests("");
    toast.info("Booking session reset. You can create a new booking.");
  };

  // Step 1: Submit Details & Create DB Record with sequential Booking Code
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!selectedPkgSlug) newErrors.package = "Please select a tour package";
    if (!customerName.trim()) newErrors.customerName = "Full name is required";
    if (!customerEmail.trim()) {
      newErrors.customerEmail = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      newErrors.customerEmail = "Invalid email address";
    }
    if (!customerPhone.trim()) {
      newErrors.customerPhone = "WhatsApp / phone number is required";
    } else if (customerPhone.replace(/[^0-9]/g, "").length < 7) {
      newErrors.customerPhone = "Phone number is too short";
    }
    if (!tripDate) newErrors.tripDate = "Tour date is required";
    if (!numberOfPeople || numberOfPeople < 1)
      newErrors.numberOfPeople = "Number of guests is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please complete all required fields properly");
      return;
    }

    if (!currentPackage) return;
    setErrors({});
    setErrorMsg("");
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your reservation record...");

    try {
      const payload = {
        packageId: currentPackage.id,
        packageName: currentPackage.nameEn || currentPackage.nameId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        numberOfPeople: Number(numberOfPeople),
        tripDate,
        tripSession: getFormattedSession(),
        pickupLocation: pickupLocation.trim(),
        specialRequests: specialRequests.trim(),
        totalPriceIdr: totals.idr,
        totalPriceUsd: totals.usd,
        paymentMethod,
        status: "pending",
      };

      let bookingData = null;
      if (submittedBooking?.id) {
        const updateRes = await fetch(`/api/bookings/${submittedBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            bookingCode: submittedBooking.bookingCode,
          }),
        });
        if (updateRes.ok) {
          const updated = await updateRes.json();
          bookingData = updated.booking || { ...submittedBooking, ...payload };
        }
      }

      if (!bookingData) {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(
            errJson.error || "Failed to create reservation. Please try again.",
          );
        }

        const data = await res.json();
        bookingData = data.booking || payload;
      }

      setSubmittedBooking(bookingData);
      toast.success("Reservation saved! Please proceed to payment details.", {
        id: toastId,
      });
      setCurrentStep(2);
      scrollToTop();
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred";
      setErrorMsg(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Handle Payment Proof Upload
  const handlePaymentProofUpload = async (file: File) => {
    setIsUploadingProof(true);
    const toastId = toast.loading("Uploading payment proof...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (submittedBooking?.id) {
        formData.append("bookingId", String(submittedBooking.id));
      }

      const res = await fetch("/api/bookings/upload-proof", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Upload failed");
      }

      const data = await res.json();
      setPaymentProofUrl(data.url);

      if (submittedBooking?.id) {
        setSubmittedBooking((prev: any) => ({
          ...prev,
          paymentProofUrl: data.url,
          paymentMethod,
        }));
        await fetch(`/api/bookings/${submittedBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            paymentProofUrl: data.url,
          }),
        }).catch(() => {});
      }

      toast.success("Payment receipt uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload payment proof", {
        id: toastId,
      });
    } finally {
      setIsUploadingProof(false);
    }
  };

  // Step 2: Proceed to Step 3 Confirmation
  const handleStep2Proceed = async (isSkippingProof: boolean = false) => {
    setIsUpdatingPayment(true);
    try {
      if (submittedBooking?.id) {
        setSubmittedBooking((prev: any) => ({
          ...prev,
          paymentMethod,
          paymentProofUrl: paymentProofUrl || prev?.paymentProofUrl || null,
        }));
        await fetch(`/api/bookings/${submittedBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            paymentProofUrl:
              paymentProofUrl || submittedBooking.paymentProofUrl || null,
          }),
        }).catch(() => {});
      }
      setCurrentStep(3);
      scrollToTop();
      if (isSkippingProof) {
        toast.info(
          "You can send your payment receipt directly to our WhatsApp admin.",
        );
      } else {
        toast.success("Payment details confirmed! Finalize on WhatsApp.");
      }
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Generate WhatsApp Message
  const getWhatsAppBookingUrl = (booking: any) => {
    const packageName = currentPackage?.nameEn || currentPackage?.nameId;
    const tripType = isPrivatePackage ? "Private" : "Public";
    const bCode =
      booking?.bookingCode || submittedBooking?.bookingCode || "ONLINE-BOOKING";
    const payLabel =
      paymentMethod === "qris"
        ? "QRIS (Scan & Pay)"
        : `Bank Transfer (${bankName})`;
    const proofStatus = paymentProofUrl
      ? "✅ Receipt Uploaded on Website"
      : "⏳ Receipt will be sent via WhatsApp";

    const msg = `Hello Admin Gili Trawangan Snorkeling Trip!
I have submitted an online booking with the following details:
- Booking Code: *${bCode}*
- Package: *${packageName}* (${tripType})
- Name: *${customerName}*
- Trip Date: *${tripDate}*
- Session & Schedule: *${getFormattedSession()}*
- Guests: *${numberOfPeople} Person(s)*
- Payment Method: *${payLabel}*
- Payment Proof: *${proofStatus}*
- Total Price: *${totals.usd ? `$${totals.usd} USD` : ""}* (~ Rp ${totals.idr.toLocaleString("id-ID")})
${numberOfPeople > PRIVATE_MAX_PAX && isPrivatePackage ? `Note: ${numberOfPeople} guests (exceeds base 4 pax limit, additional charges may apply)\n` : ""}${pickupLocation ? `- Pickup/Location: ${pickupLocation}\n` : ""}${specialRequests ? `- Special Request: ${specialRequests}\n` : ""}
Please confirm slot availability and payment receipt. Thank you!`;

    return `https://wa.me/${phoneTarget.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  const bookingCodeDisplay = submittedBooking?.bookingCode || "GILI-2026-0001";

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
      {/* Active Session Notification Bar if currently in Step 2 or 3 */}
      {submittedBooking && currentStep > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            padding: "10px 18px",
            borderRadius: "var(--radius-md)",
            background: "rgba(0, 180, 216, 0.08)",
            border: "1px solid rgba(0, 180, 216, 0.25)",
            marginBottom: "20px",
            fontSize: "0.84rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={16} color="var(--primary-ocean)" />
            <span style={{ color: "var(--primary-deep)" }}>
              Active reservation in progress:{" "}
              <strong style={{ fontFamily: "monospace" }}>
                {bookingCodeDisplay}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetBooking}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-sm)",
              padding: "4px 10px",
              fontSize: "0.78rem",
              color: "#ef4444",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <RotateCcw size={12} />
            <span>Start Fresh Booking</span>
          </button>
        </div>
      )}

      {/* 🌟 TOP 3-STEP WIZARD PROGRESS BAR */}
      <div
        className="glass-card"
        style={{
          padding: "18px 24px",
          marginBottom: "32px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 50, 100, 0.05)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Step 1 Node */}
          <div
            onClick={() => {
              if (currentStep > 1) setCurrentStep(1);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: currentStep > 1 ? "pointer" : "default",
              opacity: currentStep === 1 ? 1 : 0.85,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background:
                  currentStep === 1
                    ? "var(--primary-ocean)"
                    : currentStep > 1
                      ? "#10b981"
                      : "#f1f5f9",
                color: currentStep >= 1 ? "#ffffff" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow:
                  currentStep === 1
                    ? "0 0 0 4px rgba(0, 180, 216, 0.2)"
                    : "none",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {currentStep > 1 ? <Check size={20} strokeWidth={2.5} /> : "1"}
            </div>
            <div className="d-none-mobile">
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color:
                    currentStep === 1
                      ? "var(--primary-deep)"
                      : currentStep > 1
                        ? "#059669"
                        : "#64748b",
                }}
              >
                1. {t("step1")}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {t("step1Desc")}
              </div>
            </div>
          </div>

          {/* Connector 1 -> 2 */}
          <div
            style={{
              height: "2px",
              background: currentStep >= 2 ? "#10b981" : "#e2e8f0",
              flex: 1,
              minWidth: "24px",
              transition: "background 0.3s ease",
            }}
          />

          {/* Step 2 Node */}
          <div
            onClick={() => {
              if (submittedBooking && currentStep === 3) setCurrentStep(2);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor:
                submittedBooking && currentStep === 3 ? "pointer" : "default",
              opacity: currentStep === 2 ? 1 : currentStep > 2 ? 0.85 : 0.6,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background:
                  currentStep === 2
                    ? "var(--primary-ocean)"
                    : currentStep > 2
                      ? "#10b981"
                      : "#f1f5f9",
                color: currentStep >= 2 ? "#ffffff" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow:
                  currentStep === 2
                    ? "0 0 0 4px rgba(0, 180, 216, 0.2)"
                    : "none",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {currentStep > 2 ? <Check size={20} strokeWidth={2.5} /> : "2"}
            </div>
            <div className="d-none-mobile">
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color:
                    currentStep === 2
                      ? "var(--primary-deep)"
                      : currentStep > 2
                        ? "#059669"
                        : "#64748b",
                }}
              >
                2. {t("step2")}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {t("step2Desc")}
              </div>
            </div>
          </div>

          {/* Connector 2 -> 3 */}
          <div
            style={{
              height: "2px",
              background: currentStep === 3 ? "#10b981" : "#e2e8f0",
              flex: 1,
              minWidth: "24px",
              transition: "background 0.3s ease",
            }}
          />

          {/* Step 3 Node */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: currentStep === 3 ? 1 : 0.6,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: currentStep === 3 ? "#10b981" : "#f1f5f9",
                color: currentStep === 3 ? "#ffffff" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow:
                  currentStep === 3
                    ? "0 0 0 4px rgba(16, 185, 129, 0.2)"
                    : "none",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div className="d-none-mobile">
              <div
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  color: currentStep === 3 ? "#059669" : "#64748b",
                }}
              >
                3. {t("step3")}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {t("step3Desc")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📝 STEP 1: RESERVATION DETAILS FORM */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Left Column: Input Form */}
          <div className="glass-card" style={{ padding: "36px 30px" }}>
            <div style={{ marginBottom: "24px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--primary-surface)",
                  color: "var(--primary-ocean)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                <Clock size={13} />
                STEP 1 OF 3
              </span>
              <h2
                style={{
                  fontSize: "1.45rem",
                  color: "var(--primary-deep)",
                  margin: 0,
                }}
              >
                {t("title")}
              </h2>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {t("subtitle")}
              </p>
            </div>

            <form onSubmit={handleStep1Submit}>
              {errorMsg && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    marginBottom: "20px",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Custom Package Dropdown */}
              <div className="form-group">
                <CustomSelect
                  label={
                    <>
                      {t("selectPackage")}{" "}
                      <span style={{ color: "#ef4444", fontWeight: 700 }}>
                        *
                      </span>
                    </>
                  }
                  value={selectedPkgSlug}
                  onChange={(val) => {
                    setSelectedPkgSlug(val);
                    if (errors.package)
                      setErrors((prev) => ({ ...prev, package: "" }));
                  }}
                  error={errors.package}
                  options={packagesList.map((pkg) => {
                    const isPkgPrivate =
                      pkg.priceUnit === "per_boat" ||
                      (!pkg.priceUnit && pkg.price > 500000);
                    return {
                      value: pkg.slug,
                      label: pkg.nameEn || pkg.nameId,
                      subtitle: `$${pkg.priceUsd} USD / ${pkg.durationEn || pkg.durationId || "4-5 Hours"} (~Rp ${pkg.price.toLocaleString("id-ID")}) • ${isPkgPrivate ? "Private" : "Public"}`,
                      badge: pkg.isFeatured
                        ? "Popular"
                        : isPkgPrivate
                          ? "Private"
                          : undefined,
                    };
                  })}
                />
              </div>

              {/* Package Type Indicator */}
              {currentPackage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: isPrivatePackage
                      ? "rgba(217, 119, 6, 0.08)"
                      : "var(--primary-surface)",
                    border: isPrivatePackage
                      ? "1px solid rgba(217, 119, 6, 0.2)"
                      : "1px solid rgba(0, 180, 216, 0.2)",
                    marginBottom: "16px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: isPrivatePackage
                      ? "#b45309"
                      : "var(--primary-ocean)",
                  }}
                >
                  <Info size={14} />
                  <span>
                    {isPrivatePackage
                      ? `Private Trip — Max. ${PRIVATE_MAX_PAX} Pax included • Flexible Schedule`
                      : "Public Shared Trip — Per Person Rate • Fixed Schedule"}
                  </span>
                </div>
              )}

              {/* 2. Customer Name */}
              <div className="form-group">
                <label className="form-label">
                  {t("fullName")}{" "}
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("fullNamePlaceholder")}
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName)
                      setErrors((prev) => ({ ...prev, customerName: "" }));
                  }}
                  style={
                    errors.customerName
                      ? { borderColor: "#ef4444", backgroundColor: "#fffbfa" }
                      : {}
                  }
                />
                {errors.customerName && (
                  <span
                    style={{
                      color: "#ef4444",
                      fontSize: "0.75rem",
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontWeight: 500,
                    }}
                  >
                    <AlertCircle size={12} />
                    {errors.customerName}
                  </span>
                )}
              </div>

              {/* 3. Customer Email & Phone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    {t("email")}{" "}
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder={t("emailPlaceholder")}
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (errors.customerEmail)
                        setErrors((prev) => ({ ...prev, customerEmail: "" }));
                    }}
                    style={
                      errors.customerEmail
                        ? { borderColor: "#ef4444", backgroundColor: "#fffbfa" }
                        : {}
                    }
                  />
                  {errors.customerEmail && (
                    <span
                      style={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500,
                      }}
                    >
                      <AlertCircle size={12} />
                      {errors.customerEmail}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {t("phone")}{" "}
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder={t("phonePlaceholder")}
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone)
                        setErrors((prev) => ({ ...prev, customerPhone: "" }));
                    }}
                    style={
                      errors.customerPhone
                        ? { borderColor: "#ef4444", backgroundColor: "#fffbfa" }
                        : {}
                    }
                  />
                  {errors.customerPhone && (
                    <span
                      style={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500,
                      }}
                    >
                      <AlertCircle size={12} />
                      {errors.customerPhone}
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Number of People & Date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    {t("pax")}{" "}
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setNumberOfPeople((prev) => {
                          const nextVal = Math.max(1, prev - 1);
                          if (errors.numberOfPeople)
                            setErrors((err) => ({
                              ...err,
                              numberOfPeople: "",
                            }));
                          return nextVal;
                        });
                      }}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-light)",
                        background: "#ffffff",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--primary-deep)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      className="form-control"
                      value={numberOfPeople}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setNumberOfPeople(val);
                        if (errors.numberOfPeople)
                          setErrors((prev) => ({
                            ...prev,
                            numberOfPeople: "",
                          }));
                      }}
                      style={{
                        textAlign: "center",
                        fontWeight: 700,
                        ...(errors.numberOfPeople
                          ? {
                              borderColor: "#ef4444",
                              backgroundColor: "#fffbfa",
                            }
                          : {}),
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNumberOfPeople((prev) => {
                          const nextVal = Math.min(50, prev + 1);
                          if (errors.numberOfPeople)
                            setErrors((err) => ({
                              ...err,
                              numberOfPeople: "",
                            }));
                          return nextVal;
                        });
                      }}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-light)",
                        background: "#ffffff",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--primary-deep)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                  {errors.numberOfPeople && (
                    <span
                      style={{
                        color: "#ef4444",
                        fontSize: "0.75rem",
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: 500,
                      }}
                    >
                      <AlertCircle size={12} />
                      {errors.numberOfPeople}
                    </span>
                  )}
                  {isPrivatePackage && (
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "0.75rem",
                        color:
                          numberOfPeople > PRIVATE_MAX_PAX
                            ? "#b45309"
                            : "#475569",
                        background:
                          numberOfPeople > PRIVATE_MAX_PAX
                            ? "#fffbeb"
                            : "#f8fafc",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        border:
                          numberOfPeople > PRIVATE_MAX_PAX
                            ? "1px solid #fde68a"
                            : "1px solid var(--border-light)",
                        lineHeight: 1.4,
                      }}
                    >
                      <AlertCircle
                        size={14}
                        color={
                          numberOfPeople > PRIVATE_MAX_PAX
                            ? "#b45309"
                            : "#0284c7"
                        }
                        style={{ flexShrink: 0, marginTop: "2px" }}
                      />
                      <span>
                        {numberOfPeople > PRIVATE_MAX_PAX ? (
                          <>
                            <strong>
                              {numberOfPeople} Guests selected (
                              {numberOfPeople - PRIVATE_MAX_PAX} extra).
                            </strong>{" "}
                            Standard private trip rate covers up to{" "}
                            {PRIVATE_MAX_PAX} pax. Additional charges apply for
                            extra guests.
                          </>
                        ) : (
                          <>
                            Max. {PRIVATE_MAX_PAX} Pax included in base private
                            trip. <strong>{t("extraChargeWarning")}</strong>.
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <ModernDatePicker
                    label={
                      <>
                        {t("tripDate")}{" "}
                        <span style={{ color: "#ef4444", fontWeight: 700 }}>
                          *
                        </span>
                      </>
                    }
                    value={tripDate}
                    onChange={(d) => {
                      setTripDate(d);
                      if (errors.tripDate)
                        setErrors((prev) => ({ ...prev, tripDate: "" }));
                    }}
                    error={errors.tripDate}
                    locale="en"
                  />
                </div>
              </div>

              {/* 5. Session Time Picker */}
              <div className="form-group">
                <SessionTimePicker
                  label={
                    <>
                      {t("session")}{" "}
                      <span style={{ color: "#ef4444", fontWeight: 700 }}>
                        *
                      </span>
                    </>
                  }
                  value={tripSession}
                  onChange={(s) => {
                    setTripSession(s);
                    if (errors.tripSession)
                      setErrors((prev) => ({ ...prev, tripSession: "" }));
                  }}
                  departureTime={departureTime}
                  onDepartureTimeChange={setDepartureTime}
                  duration={tripDuration}
                  onDurationChange={setTripDuration}
                  error={errors.tripSession}
                  locale="en"
                  packageType={packageType}
                />
              </div>

              {/* 6. Pickup Location (Optional) */}
              <div className="form-group">
                <label className="form-label">{t("pickup")}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("pickupPlaceholder")}
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>

              {/* 7. Special Requests */}
              <div className="form-group">
                <label className="form-label">{t("notes")}</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder={t("notesPlaceholder")}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* Step 1 Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "16px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 8px 24px rgba(0, 180, 216, 0.3)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={20}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <span>{t("submitting")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("continueToPayment")}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Selected Package Summary Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {currentPackage && (
              <div
                className="glass-card"
                style={{
                  padding: "28px",
                  border: "1px solid var(--border-light)",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--primary-ocean)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <Compass size={16} />
                    <span>PACKAGE SUMMARY</span>
                  </div>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: isPrivatePackage ? "#fef3c7" : "#dbeafe",
                      color: isPrivatePackage ? "#92400e" : "#1e40af",
                      border: isPrivatePackage
                        ? "1px solid #fde68a"
                        : "1px solid #93c5fd",
                    }}
                  >
                    {isPrivatePackage ? "PRIVATE TRIP" : "PUBLIC SHARED"}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--primary-deep)",
                    marginBottom: "8px",
                  }}
                >
                  {currentPackage.nameEn || currentPackage.nameId}
                </h3>

                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    marginBottom: "18px",
                    lineHeight: 1.5,
                  }}
                >
                  {currentPackage.descriptionEn || currentPackage.descriptionId}
                </p>

                {/* Price Breakdown */}
                <div
                  style={{
                    background: "var(--bg-alt)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "0.88rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      {isPrivatePackage
                        ? "Base Private Trip (1-4 Pax)"
                        : `Rate per Person (${numberOfPeople}x)`}
                    </span>
                    <span
                      style={{ fontWeight: 600, color: "var(--text-main)" }}
                    >
                      {formatUsd(totals.usd)}{" "}
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        ({formatIdr(totals.idr)})
                      </span>
                    </span>
                  </div>

                  {isPrivatePackage && numberOfPeople > PRIVATE_MAX_PAX && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        fontSize: "0.82rem",
                        color: "#b45309",
                      }}
                    >
                      <span>
                        Extra Guests (+{numberOfPeople - PRIVATE_MAX_PAX} Pax):
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        Additional charge applies
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      borderTop: "1px dashed var(--border-light)",
                      paddingTop: "10px",
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--primary-deep)",
                        fontSize: "0.95rem",
                      }}
                    >
                      {t("estimatedTotal")}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 800,
                          color: "var(--primary-ocean)",
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {formatUsd(totals.usd)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        approx. {formatIdr(totals.idr)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Box */}
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(37, 211, 102, 0.08)",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MessageCircle size={18} color="#16a34a" />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#166534",
                      }}
                    >
                      Need Quick Assistance?
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: "#15803d",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    Have custom schedule requests or question about pickup? Chat
                    with our local coordinator directly.
                  </p>
                  <a
                    href={`https://wa.me/${phoneTarget.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hello! I'm interested in the ${currentPackage.nameEn || currentPackage.nameId} tour package.`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-sm"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: "0.82rem",
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>{tCta("whatsappButton")}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💳 STEP 2: PAYMENT & PROOF UPLOAD */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div
          className="glass-card"
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "36px 30px",
            border: "1.5px solid rgba(0, 180, 216, 0.3)",
            boxShadow: "0 8px 30px rgba(0, 50, 100, 0.08)",
          }}
        >
          {/* Header with Generated Booking Code */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: "#dbeafe",
                color: "#1e40af",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              <CreditCard size={14} />
              <span>STEP 2 OF 3: PAYMENT</span>
            </div>

            <h2
              style={{
                fontSize: "1.6rem",
                color: "var(--primary-deep)",
                marginBottom: "8px",
              }}
            >
              Payment & Transfer Details
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                maxWidth: "520px",
                margin: "0 auto 14px",
              }}
            >
              Your reservation has been created. Please complete the payment of{" "}
              <strong style={{ color: "var(--primary-ocean)" }}>
                {formatUsd(totals.usd)} (~ {formatIdr(totals.idr)})
              </strong>{" "}
              using one of the options below.
            </p>

            {/* Official Booking Reference Code Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#f8fafc",
                border: "1.5px dashed var(--primary-ocean)",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    display: "block",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Booking Reference Code
                </span>
                <strong
                  style={{
                    fontSize: "1.15rem",
                    color: "var(--primary-deep)",
                    fontFamily: "monospace",
                    letterSpacing: "0.04em",
                  }}
                >
                  {bookingCodeDisplay}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(bookingCodeDisplay);
                  setCopiedCode(true);
                  toast.success("Booking code copied to clipboard!");
                  setTimeout(() => setCopiedCode(false), 2500);
                }}
                style={{
                  background: copiedCode ? "#d1fae5" : "var(--primary-surface)",
                  border: "1px solid var(--primary-ocean)",
                  color: copiedCode ? "#065f46" : "var(--primary-ocean)",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--primary-navy)",
                display: "block",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Choose Payment Method:
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                style={{
                  padding: "16px 14px",
                  borderRadius: "var(--radius-md)",
                  border:
                    paymentMethod === "qris"
                      ? "2px solid var(--primary-ocean)"
                      : "1px solid var(--border-light)",
                  background:
                    paymentMethod === "qris"
                      ? "var(--primary-surface)"
                      : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "left",
                  boxShadow:
                    paymentMethod === "qris"
                      ? "0 4px 12px rgba(0, 180, 216, 0.15)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "8px",
                    background:
                      paymentMethod === "qris" ? "#00b4d8" : "#f1f5f9",
                    color: paymentMethod === "qris" ? "#ffffff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={22} />
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color:
                        paymentMethod === "qris"
                          ? "var(--primary-deep)"
                          : "var(--text-main)",
                    }}
                  >
                    QRIS (Scan & Pay)
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Instant E-Wallet & Mobile Banking
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                style={{
                  padding: "16px 14px",
                  borderRadius: "var(--radius-md)",
                  border:
                    paymentMethod === "bank_transfer"
                      ? "2px solid var(--primary-ocean)"
                      : "1px solid var(--border-light)",
                  background:
                    paymentMethod === "bank_transfer"
                      ? "var(--primary-surface)"
                      : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "left",
                  boxShadow:
                    paymentMethod === "bank_transfer"
                      ? "0 4px 12px rgba(0, 180, 216, 0.15)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "8px",
                    background:
                      paymentMethod === "bank_transfer"
                        ? "var(--primary-ocean)"
                        : "#f1f5f9",
                    color:
                      paymentMethod === "bank_transfer" ? "#ffffff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color:
                        paymentMethod === "bank_transfer"
                          ? "var(--primary-deep)"
                          : "var(--text-main)",
                    }}
                  >
                    Bank Transfer
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    Manual Bank Transfer
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* ACTIVE PAYMENT METHOD DETAILS */}
          {paymentMethod === "qris" && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "24px 20px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "#dbeafe",
                  color: "#1e40af",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                <QrCode size={14} />
                <span>QRIS CODE (SCAN & PAY)</span>
              </div>

              {qrisImage ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    onClick={() => setShowQrisModal(true)}
                    style={{
                      background: "#ffffff",
                      padding: "16px",
                      borderRadius: "16px",
                      border: "2px solid var(--primary-ocean)",
                      display: "inline-block",
                      boxShadow: "0 6px 20px rgba(0, 180, 216, 0.18)",
                      cursor: "pointer",
                    }}
                    title="Click to view full size QR code"
                  >
                    <img
                      src={qrisImage}
                      alt="QRIS Barcode"
                      style={{
                        width: "280px",
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowQrisModal(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--primary-ocean)",
                        background: "var(--primary-surface)",
                        color: "var(--primary-ocean)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Maximize2 size={13} />
                      <span>Fullscreen QR View</span>
                    </button>
                    <a
                      href={qrisImage}
                      download="QRIS-Trip-Snorkeling-Gili.png"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border-light)",
                        background: "#ffffff",
                        color: "var(--primary-deep)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <Download size={13} />
                      <span>Download QR Image</span>
                    </a>
                  </div>

                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--primary-deep)",
                    }}
                  >
                    {qrisName}
                  </div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      maxWidth: "440px",
                      margin: "0 auto",
                      lineHeight: 1.5,
                    }}
                  >
                    Scan the QR code above using your mobile banking or e-wallet
                    app (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay,
                    etc.).
                  </p>
                </div>
              ) : (
                <div style={{ padding: "24px 0" }}>
                  <QrCode
                    size={56}
                    color="var(--primary-ocean)"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--primary-deep)",
                      marginBottom: "4px",
                    }}
                  >
                    {qrisName}
                  </div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      maxWidth: "380px",
                      margin: "0 auto",
                    }}
                  >
                    QRIS payment details will also be confirmed directly via
                    WhatsApp support.
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "22px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                <Building2 size={18} color="var(--primary-ocean)" />
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--primary-deep)",
                  }}
                >
                  {bankName}
                </span>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "16px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        display: "block",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Account Number
                    </span>
                    <strong
                      style={{
                        fontSize: "1.35rem",
                        color: "var(--primary-ocean)",
                        letterSpacing: "0.04em",
                        fontFamily: "monospace",
                      }}
                    >
                      {bankNumber}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        bankNumber.replace(/[^0-9]/g, ""),
                      );
                      setCopiedBank(true);
                      toast.success("Account number copied to clipboard!");
                      setTimeout(() => setCopiedBank(false), 2500);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid var(--primary-ocean)",
                      background: copiedBank
                        ? "#d1fae5"
                        : "var(--primary-surface)",
                      color: copiedBank ? "#065f46" : "var(--primary-ocean)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {copiedBank ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedBank ? "Copied!" : "Copy Number"}</span>
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px dashed var(--border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    Account Holder:
                  </span>
                  <strong style={{ color: "var(--primary-deep)" }}>
                    {bankHolder}
                  </strong>
                </div>
              </div>

              {bankNotes && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}
                >
                  {bankNotes}
                </p>
              )}
            </div>
          )}

          {/* Upload Payment Proof Box */}
          <div
            style={{
              background: "#fffbeb",
              borderRadius: "var(--radius-md)",
              padding: "20px",
              border: "1px dashed #d97706",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <Upload size={18} color="#b45309" />
              <span
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "#92400e",
                }}
              >
                {t("paymentProofTitle")} (Recommended)
              </span>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#a16207",
                marginBottom: "14px",
                lineHeight: 1.4,
              }}
            >
              {t("paymentProofDesc")}
            </p>

            {paymentProofUrl ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "#d1fae5",
                    color: "#065f46",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Payment Receipt Uploaded!</span>
                </div>
                <div>
                  <img
                    src={paymentProofUrl}
                    alt="Payment proof"
                    style={{
                      maxWidth: "220px",
                      maxHeight: "160px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid #e5e7eb",
                      marginTop: "4px",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePaymentProofUpload(file);
                  }}
                />
                <button
                  type="button"
                  disabled={isUploadingProof}
                  onClick={() => proofInputRef.current?.click()}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid #d97706",
                    background: "#ffffff",
                    color: "#b45309",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: isUploadingProof ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isUploadingProof ? (
                    <Loader2
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <Upload size={18} />
                  )}
                  <span>
                    {isUploadingProof
                      ? t("paymentProofUploading")
                      : t("paymentProofUpload")}
                  </span>
                </button>
                <span
                  style={{
                    fontSize: "0.74rem",
                    color: "#a16207",
                    textAlign: "center",
                  }}
                >
                  {t("paymentProofOptional")}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons for Step 2 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <button
              type="button"
              disabled={isUpdatingPayment}
              onClick={() => handleStep2Proceed(false)}
              className="btn btn-primary btn-lg"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.05rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(0, 180, 216, 0.3)",
              }}
            >
              <CheckCircle2 size={20} />
              <span>{t("proceedToConfirm")}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleStep2Proceed(true)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "#ffffff",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {t("payLater")}
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                cursor: "pointer",
                textAlign: "center",
                marginTop: "4px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
            >
              <ArrowLeft size={14} />
              <span>{t("backToStep1")}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 STEP 3: CONFIRMATION & WHATSAPP */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div
          className="glass-card"
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "40px 30px",
            textAlign: "center",
            border: "2px solid var(--accent-green)",
            boxShadow: "0 12px 36px rgba(34, 197, 94, 0.12)",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.15)",
              color: "var(--accent-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 0 8px rgba(34, 197, 94, 0.08)",
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h2
            style={{
              fontSize: "1.65rem",
              color: "var(--primary-deep)",
              marginBottom: "8px",
            }}
          >
            {t("successTitle")}
          </h2>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              marginBottom: "20px",
              lineHeight: 1.5,
            }}
          >
            {t("successDesc")}
            <strong
              style={{
                color: "var(--primary-ocean)",
                fontSize: "1.2rem",
                display: "block",
                marginTop: "6px",
                fontFamily: "monospace",
                letterSpacing: "0.04em",
              }}
            >
              {bookingCodeDisplay}
            </strong>
          </p>

          {/* Booking Summary Box */}
          <div
            style={{
              background: "var(--bg-alt)",
              borderRadius: "var(--radius-md)",
              padding: "22px",
              textAlign: "left",
              marginBottom: "24px",
              border: "1px solid var(--border-light)",
            }}
          >
            <h4
              style={{
                fontSize: "0.95rem",
                color: "var(--primary-navy)",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{t("summaryTitle")}:</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  background: paymentProofUrl ? "#d1fae5" : "#fef3c7",
                  color: paymentProofUrl ? "#065f46" : "#92400e",
                  fontWeight: 700,
                }}
              >
                {paymentProofUrl
                  ? "Receipt Uploaded"
                  : "Awaiting WhatsApp Verification"}
              </span>
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
                fontSize: "0.88rem",
              }}
            >
              <div>
                <strong>Package:</strong>{" "}
                {currentPackage?.nameEn || currentPackage?.nameId} (
                {isPrivatePackage ? "Private" : "Public"})
              </div>
              <div>
                <strong>Customer Name:</strong> {customerName}
              </div>
              <div>
                <strong>Tour Date:</strong> {tripDate}
              </div>
              <div>
                <strong>Schedule:</strong> {getFormattedSession()}
              </div>
              <div>
                <strong>Guests:</strong> {numberOfPeople} Person(s)
              </div>
              <div>
                <strong>Payment Method:</strong>{" "}
                {paymentMethod === "qris"
                  ? "QRIS (Scan & Pay)"
                  : `Bank Transfer (${bankName})`}
              </div>
              <div>
                <strong>Total Amount:</strong> {formatUsd(totals.usd)} USD (~{" "}
                {formatIdr(totals.idr)})
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-muted)",
              marginBottom: "24px",
              lineHeight: 1.5,
              maxWidth: "520px",
              margin: "0 auto 24px",
            }}
          >
            {t("successNote")}
          </p>

          {/* Primary Action: Open WhatsApp */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            <a
              href={getWhatsAppBookingUrl(submittedBooking)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1rem",
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(37, 211, 102, 0.35)",
              }}
            >
              <MessageCircle size={22} />
              <span>{t("chatWaNow")}</span>
            </a>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "#ffffff",
                color: "var(--primary-deep)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("backToStep2")}
            </button>

            <button
              type="button"
              onClick={handleResetBooking}
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "4px" }}
            >
              <RotateCcw size={15} />
              <span>Create Another Booking</span>
            </button>
          </div>
        </div>
      )}

      {/* QRIS FULLSCREEN / ZOOM PREVIEW MODAL */}
      {showQrisModal && qrisImage && (
        <div
          onClick={() => setShowQrisModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#ffffff",
              borderRadius: "var(--radius-lg)",
              maxWidth: "460px",
              width: "100%",
              padding: "28px 24px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setShowQrisModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid var(--border-light)",
                background: "#f8fafc",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "#dbeafe",
                  color: "#1e40af",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                <QrCode size={14} />
                <span>QRIS SCAN & PAY</span>
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--primary-deep)",
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                {qrisName}
              </h3>
            </div>

            <div
              style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "16px",
                border: "2px solid var(--primary-ocean)",
                display: "inline-block",
                marginBottom: "16px",
                boxShadow: "0 8px 24px rgba(0, 180, 216, 0.2)",
              }}
            >
              <img
                src={qrisImage}
                alt="QRIS Barcode Enlarged"
                style={{
                  width: "320px",
                  maxWidth: "100%",
                  maxHeight: "55vh",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
            </div>

            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                marginBottom: "18px",
                lineHeight: 1.5,
                padding: "0 10px",
              }}
            >
              Open your e-Wallet or Mobile Banking app (BCA, Mandiri, BRI, BNI,
              GoPay, OVO, Dana, ShopeePay), and scan the QR code above.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <a
                href={qrisImage}
                download="QRIS-Trip-Snorkeling-Gili.png"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                }}
              >
                <Download size={15} />
                <span>Download QR Image</span>
              </a>
              <button
                type="button"
                onClick={() => setShowQrisModal(false)}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: "8px 18px",
                  fontSize: "0.85rem",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
