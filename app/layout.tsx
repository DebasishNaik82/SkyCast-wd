import './globals.css';
import { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'SkyCast',
  description: 'A high-precision weather dashboard with real-time updates and localized forecasts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="font-serif" suppressHydrationWarning>{children}</body>
    </html>
  );
}
