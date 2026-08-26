'use client';

import React from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#00b4d8"
        initialPosition={0.15}
        crawlSpeed={200}
        height={3.5}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={250}
        shadow="0 0 12px #00b4d8, 0 0 6px #0077b6"
        zIndex={99999}
      />
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        theme="light"
      />
    </>
  );
}
