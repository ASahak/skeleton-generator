import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import theme from '@/styles/theme';
import { ColorModeScript } from '@chakra-ui/react';
import { AppProviders } from '@/providers/app';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
  minimumScale: 1,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Skeleton generator',
  description: 'Generate skeleton loading animations for your website to enhance user experience during page loading. Improve perceived performance and engage users with a visually appealing loading experience.',
  keywords: ['skeleton loading', 'loading generator', 'web performance', 'user experience', 'website loading', 'page speed'],
  authors: [
    { name: 'ASahak' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: 'image/x-icon',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
