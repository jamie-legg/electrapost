// metadata.ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ElectroQuery',
  description: 'An open-source Electron-based database client built with TypeScript and Next.js',
  openGraph: {
    title: 'ElectroQuery',
    description: 'Powerful, cross-platform database management made easy',
    url: 'https://electroquery.dev',
    siteName: 'ElectroQuery',
    images: [
      {
        url: 'https://electroquery.dev/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ElectroQuery - Open Source Database Client',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@electroquery',
    title: 'ElectroQuery',
    description: 'Open-source Electron database client with TypeScript and Next.js',
    images: ['https://electroquery.dev/images/twitter-card.png'],
  },
  keywords: ['database client', 'electron', 'typescript', 'nextjs', 'open source'],
  authors: [{ name: 'ElectroQuery Team' }],
  creator: 'ElectroQuery Team',
  publisher: 'ElectroQuery',
  applicationName: 'ElectroQuery',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  category: 'Technology',
};
