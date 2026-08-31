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
  title: 'Gili Trawangan Snorkeling Trip | Best 3-Gili Snorkeling Tours',
  description: 'Licensed premier snorkeling trip provider in Gili Trawangan, Gili Meno, and Gili Air. Swim with sea turtles at Turtle Point, underwater Bask Nest statues, Blue Coral reefs, free GoPro HD photo & video documentation.',
  keywords: [
    'gili trawangan snorkeling trip',
    'snorkeling gili trawangan',
    '3 gilis snorkeling tour',
    'gili meno turtle point',
    'underwater statues gili meno',
    'private boat gili trawangan',
    'glass bottom boat gili',
    'snorkeling lombok gili',
  ],
  authors: [{ name: 'Gili Trawangan Snorkeling Trip' }],
  openGraph: {
    title: 'Gili Trawangan Snorkeling Trip | Best 3-Gili Snorkeling Tours',
    description: 'Swim with sea turtles at Turtle Point & Underwater Statues. Free GoPro HD Underwater Photo & Video.',
    url: 'https://snorkelinggilitrawangan.vercel.app',
    siteName: 'Gili Trawangan Snorkeling Trip',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Snorkeling Gili Trawangan',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
