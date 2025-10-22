import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n/Provider';

export const metadata: Metadata = {
  title: 'Polymarket Hype Radar - Real-time Prediction Markets Tracker',
  description: 'Track the hottest prediction markets on Polymarket in real-time, view trading volume and price change rankings',
  keywords: 'Polymarket, prediction markets, volume, trending, trading',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
