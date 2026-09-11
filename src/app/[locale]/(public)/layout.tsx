import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import CurrencyProvider from "@/components/providers/CurrencyProvider";
import { getSettings, getPackagesList } from "@/lib/data";
import type { CurrencyCode } from "@/lib/format";

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

  const settingValue = (key: string) =>
    settings.find((s) => s.key === key)?.value;

  const usdRate = Number(settingValue("currency_usd_rate")) || undefined;
  const eurRate = Number(settingValue("currency_eur_rate")) || undefined;
  const savedDefault = settingValue("default_currency");
  const defaultCurrency: CurrencyCode =
    savedDefault === "IDR" || savedDefault === "EUR" || savedDefault === "USD"
      ? savedDefault
      : "USD";

  return (
    <CurrencyProvider
      usdRate={usdRate}
      eurRate={eurRate}
      defaultCurrency={defaultCurrency}
    >
      <Navbar whatsappNumber={whatsappNumber} siteSettings={settings} />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer siteSettings={settings} packages={activePackages} />
      <WhatsAppButton whatsappNumber={whatsappNumber} />
    </CurrencyProvider>
  );
}
