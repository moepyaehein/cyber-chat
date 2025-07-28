
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CyGuard: Your Privacy & Security Chatbot',
  description: 'A smart, privacy-first cybersecurity assistant to help you identify online threats and stay safe. Your conversations are not stored.',
  icons: null, 
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22hsl(200 80% 60%)%22><path d=%22M12 2L3.86 5.54a2 2 0 00-1.36 1.86v6.23a9 9 0 004.5 7.86L12 22l6-1.5a9 9 0 004.5-7.86V7.4a2 2 0 00-1.36-1.86L12 2zm0 3.17L17.14 7.4v6.23a7 7 0 01-3.5 6.16l-1.64.93V12.5a2.5 2.5 0 00-5 0v8.22l-1.64-.93a7 7 0 01-3.5-6.16V7.4L12 5.17zm0 5.33a1.5 1.5 0 110 3 1.5 1.5 0 010-3z%22/%3E%3C/svg%3E" />
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
