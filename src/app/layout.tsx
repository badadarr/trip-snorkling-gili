import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trip Snorkeling Gili Trawangan | Spot Snorkeling Terbaik 3 Gili',
  description: 'Penyedia wisata trip snorkeling berlisensi di Gili Trawangan, Gili Meno, dan Gili Air. Berenang bersama penyu di Turtle Point, patung bawah laut Bask Nest, terumbu karang Blue Coral, free foto GoPro underwater HD.',
  keywords: [
    'trip snorkeling gili trawangan',
    'snorkeling gili trawangan',
    'snorkeling 3 gili',
    'gili meno turtle point',
    'underwater statues gili meno',
    'private boat gili trawangan',
    'glass bottom boat gili',
    'snorkeling lombok gili',
  ],
  authors: [{ name: 'Trip Snorkeling Gili Trawangan' }],
  openGraph: {
    title: 'Trip Snorkeling Gili Trawangan | Spot Snorkeling Terbaik 3 Gili',
    description: 'Berenang bersama Penyu di Turtle Point & Patung Bawah Laut Meno. Free GoPro HD Underwater Photo & Video.',
    url: 'https://snorkelinggilitrawangan.vercel.app',
    siteName: 'Trip Snorkeling Gili Trawangan',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Snorkeling Gili Trawangan',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
