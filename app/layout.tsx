import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'LUXORA — Elegance Beyond Ordinary',
  description: 'A sophisticated luxury fashion destination for men and women.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap" />
        {/* If JavaScript is off, skip the intro so the homepage is usable */}
        <noscript><style>{'#intro{display:none}body.lock{overflow:auto!important}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
