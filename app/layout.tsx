import type React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ModalProvider } from "@/components/modals/modal-provider";
import { WagmiProviders } from "@/components/providers/wagmi-provider";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    'RiseGate - Hệ thống trích xuất "sinh trắc học" tài liệu và Xác thực tài liệu',
  description:
    'Hệ thống trích xuất "sinh trắc học" tài liệu và lưu trữ blockchain phục vụ xác minh bản gốc',
  generator: "verify-document.risegate.io",
  applicationName: "RiseGate",
  icons: {
    icon: "/logo-risegate.svg", // favicon chính
    shortcut: "/logo-risegate.svg",
    apple: "/logo-risegate.svg",
  },
  openGraph: {
    title:
      'RiseGate - Hệ thống trích xuất "sinh trắc học" tài liệu và Xác thực tài liệu',
    description:
      'Hệ thống trích xuất "sinh trắc học" tài liệu và lưu trữ blockchain phục vụ xác minh bản gốc',
    url: "https://verify-document.risegate.io",
    siteName: "RiseGate",
    images: [
      {
        url: "https://res.cloudinary.com/dfbbhslan/image/upload/v1748264399/Screenshot_2025-05-26_at_19.59.05_rrwgpq.png",
        width: 1200,
        height: 630,
        alt: "RiseGate Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.className} suppressHydrationWarning>
        <Toaster />
        <WagmiProviders>
          <ModalProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              {children}
              <Footer />
            </div>
          </ModalProvider>
        </WagmiProviders>
      </body>
    </html>
  );
}
