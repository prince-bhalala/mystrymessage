import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/authProviders';
import {Toaster} from '@/components/ui/sonner'
import Navbar from '@/components/navbar';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default  function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body className={inter.className}>
          <Navbar/>
          {children}
          <Toaster/>
        </body>
      </AuthProvider>
    </html>
  );
}
