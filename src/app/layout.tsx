
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CyGuard: Your Privacy & Security Chatbot',
  description: 'A smart, privacy-first cybersecurity assistant to help you identify online threats and stay safe. Your conversations are not stored.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 233"><path fill="%234A90E2" d="M9.829 45.424 81 0l71.171 45.424v123.59L81 214.438l-71.171-45.424V45.424Z"/><path fill="%23fff" d="m81 19.333 59.309 37.854v103.04L81 198.08l-59.309-37.854V57.187L81 19.333Zm0 137.94v-51.38c0-10.276-8.327-18.6-18.6-18.6s-18.6 8.324-18.6 18.6v59.888l18.6 11.859 18.6-11.86v-8.507Zm0-61.656c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Z"/><path fill="url(%23a)" d="M9.829 45.424 81 0l71.171 45.424-35.586 22.712-35.585-23.4L9.829 45.424Z"/><path fill="url(%23b)" d="m81 233 71.171-54.847v-38.304L81 185.273V233Z"/><path fill="url(%23c)" d="m9.829 178.153 71.171 54.847V185.273L9.829 139.849v38.304Z"/><path fill="%23FFC24A" d="M9.829 45.424 45.414 68.136 81 44.735 9.829 45.424Z"/><path fill="url(%23d)" d="M45.414 68.136 9.829 45.424v94.425l35.585 22.712V68.136Z"/><path fill-opacity=".2" d="M81 185.273V233l-71.171-54.847v-38.304L81 185.273Z"/><defs><linearGradient id="a" x1="81" y1="0" x2="81" y2="68.136" gradientUnits="userSpaceOnUse"><stop stop-color="%23F5A623"/><stop offset="1" stop-color="%23F8E71C"/></linearGradient><linearGradient id="b" x1="81" y1="139.849" x2="81" y2="233" gradientUnits="userSpaceOnUse"><stop stop-color="%234A90E2"/><stop offset="1" stop-color="%234A90E2"/></linearGradient><linearGradient id="c" x1="81" y1="139.849" x2="81" y2="233" gradientUnits="userSpaceOnUse"><stop stop-color="%234A90E2"/><stop offset="1" stop-color="%234A90E2"/></linearGradient><linearGradient id="d" x1="27.622" y1="45.424" x2="27.622" y2="162.561" gradientUnits="userSpaceOnUse"><stop stop-color="%23F5A623"/><stop offset="1" stop-color="%23F8E71C"/></linearGradient></defs></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
