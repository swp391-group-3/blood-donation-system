import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from './query-provider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/header';
import { BloodDonationChatbot } from '@/components/chatbot';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Life Link',
    description: 'Blood Donation System',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>
                    <Header />
                    {children}
                    <BloodDonationChatbot />
                    <Toaster richColors />
                </QueryProvider>
            </body>
        </html>
    );
}
