import type { Metadata } from 'next';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
