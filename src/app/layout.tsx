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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trip-snorkling-gili.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Gili Trawangan Snorkeling Trip | Best 3-Gili Snorkeling Tours',
    template: '%s | Gili Trawangan Snorkeling Trip',
  },
  description: 'Licensed premier snorkeling trip provider in Gili Trawangan, Gili Meno, and Gili Air. Swim with sea turtles at Turtle Point, underwater Bask Nest statues, Blue Coral reefs, free GoPro HD photo & video documentation.',
  keywords: [
    'trip snorkeling gili trawangan',
    'snorkeling gili trawangan murah',
    'paket snorkeling 3 gili',
    'snorkeling gili meno turtle point',
    'patung bawah air gili meno bask nest',
    'sewa perahu private boat gili trawangan',
    'glass bottom boat gili trawangan',
    'gili trawangan snorkeling trip',
    'best snorkeling 3 gilis lombok',
    'gili islands snorkeling tour',
  ],
  authors: [{ name: 'Gili Trawangan Snorkeling Trip', url: SITE_URL }],
  creator: 'Gili Trawangan Snorkeling Trip',
  publisher: 'Gili Trawangan Snorkeling Trip',
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/id',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Gili Trawangan Snorkeling Trip | Best 3-Gili Snorkeling Tours',
    description: 'Swim with sea turtles at Turtle Point & underwater Bask Nest statues. Free GoPro HD photos & videos included.',
    url: SITE_URL,
    siteName: 'Gili Trawangan Snorkeling Trip',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Snorkeling Gili Trawangan Sea Turtles and Coral Reefs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gili Trawangan Snorkeling Trip | Best 3-Gili Snorkeling Tours',
    description: 'Swim with sea turtles at Turtle Point & underwater statues. Free GoPro HD photos & videos.',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
