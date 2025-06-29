import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CafeteriaProvider } from './context/CafeteriaContext'; // adjust if needed
import SharedHeader from './components/SharedHeader';
import Chat from "./components/chat";
import BottomBar from "./components/BottomBar";


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NP Snatch',
  description: 'Order meals easily from your campus cafeterias.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CafeteriaProvider>
          <SharedHeader />
          
          {children}
          < Chat />
          <BottomBar />
        </CafeteriaProvider>
      </body>
    </html>
  );
}

