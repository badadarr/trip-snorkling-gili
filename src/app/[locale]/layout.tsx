import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return [{ locale: 'id' }];
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale('id');
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale="id" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
