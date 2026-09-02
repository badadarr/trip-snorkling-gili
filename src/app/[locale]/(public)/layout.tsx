import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { getSettings, getPackagesList } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, allPackages] = await Promise.all([
    getSettings(),
    getPackagesList(),
  ]);
  const waSetting = settings.find((s) => s.key === "whatsapp_number");
  const whatsappNumber = waSetting?.value || '6282236851307';
  const activePackages = allPackages.filter((p) => p.isActive);

  return (
    <>
      <Navbar whatsappNumber={whatsappNumber} />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer siteSettings={settings} packages={activePackages} />
      <WhatsAppButton whatsappNumber={whatsappNumber} />
    </>
  );
}
