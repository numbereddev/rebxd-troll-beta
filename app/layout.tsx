import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://beta.rebxd.com/"),
    title: {
        default: "Rebxd Beta Waitlist",
        template: "%s · Rebxd Beta Waitlist",
    },
    description: "Rebxd is here. Claim your waitlist seat, now.",
    category: "technology",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://beta.rebxd.com",
        title: "Rebxd Beta Waitlist",
        description: "Rebxd is here. Claim your waitlist seat, now.",
    },
    twitter: {
        title: "Rebxd Beta Waitlist",
        description: "Rebxd is here. Claim your waitlist seat, now.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
