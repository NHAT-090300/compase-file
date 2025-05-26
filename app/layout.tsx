import type React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WagmiProviders } from "@/components/providers/wagmi-provider";
import { ConnectWallet } from "@/components/wallet/connect-wallet";
import Image from "next/image";
import Link from "next/link";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Hệ thống trích xuất "sinh trắc học" tài liệu và Xác thực tài liệu',
  description:
    'Hệ thống trích xuất "sinh trắc học" tài liệu và lưu trữ blockchain phục vụ xác minh bản gốc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakarta.className} suppressHydrationWarning>
        <WagmiProviders>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center gap-2">
                    <Image
                      width={48}
                      height={48}
                      src="/logo-danang.png"
                      alt="logo"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 ml-2">
                      Sở Khoa học và Công nghệ TP Đà Nẵng
                    </h1>
                  </div>
                  <nav className="flex items-center space-x-8">
                    <Link
                      href="/"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Phát hành tài liệu
                    </Link>
                    <Link
                      href="/compare"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Xác thực tài liệu
                    </Link>
                    <Link
                      href="/guide"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Hướng dẫn
                    </Link>
                    <ConnectWallet />
                  </nav>
                </div>
              </div>
            </header>
            {children}
            {/* Footer */}
            <footer className="bg-white border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4">
                  <a href="https://risegate.vn/" target="_blank">
                    <img
                      className="cursor-pointer h-8"
                      src="/logo_risegate.svg"
                      alt="risegate"
                    />
                  </a>

                  <div className="typography-h6 flex-1 text-right">
                    <span className="text-[#9EA3AE] font-medium">
                      Powered by{" "}
                    </span>{" "}
                    <a href="https://metadap.io/" target="_blank">
                      <b className="text-[#4D5461]">MetaDAP</b>
                    </a>
                  </div>
                  <div className="typography-h6">
                    <span className="text-[#9EA3AE] font-medium">
                      Powered by{" "}
                    </span>
                    <a href="https://risegate.vn/" target="_blank">
                      <b className="text-[#4D5461]">RiseGate</b>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </WagmiProviders>
      </body>
    </html>
  );
}
