import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale('en');
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Gili Trawangan Snorkeling Trip',
    description: 'Premier snorkeling tour operator in Gili Trawangan, Gili Meno, and Gili Air. Swim with sea turtles and underwater statues with free GoPro HD documentation.',
    url: 'https://trip-snorkling-gili.vercel.app',
    touristType: ['Snorkeling', 'Island Hopping', 'Marine Sanctuary Tour'],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-8.3534',
      longitude: '116.0378',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gili Trawangan',
      addressRegion: 'Nusa Tenggara Barat',
      addressCountry: 'ID',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: '150000',
      highPrice: '1500000',
    },
  };

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </NextIntlClientProvider>
  );
}
