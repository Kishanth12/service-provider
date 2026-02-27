import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ServiceHub - Book Local Services',
  description: 'Connect with local service providers and book appointments easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}