import type { Metadata } from 'next';
import './globals.css';
import './nyt-styles.css';
import { FilterProvider } from '@/lib/filter-context';

export const metadata: Metadata = {
  title: 'TECHFOMO - Latest Tech News',
  description: 'Your ultimate source for tech news, AI, startups, and gadgets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Poppins:wght@400;500;600&family=Montserrat:wght@400;600;700;800&family=UnifrakturMaguntia&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=supreme@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <FilterProvider>
          {children}
        </FilterProvider>
        {/* Agentation Vanilla (Dev-only) */}
        <script src="https://cdn.jsdelivr.net/gh/mearnest-dev/agentation-vanilla@main/agentation-vanilla.js" async></script>
      </body>
    </html>
  );
}
