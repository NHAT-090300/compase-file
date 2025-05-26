import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProviders } from "@/components/providers/wagmi-provider";
import { ConnectWallet } from "@/components/wallet/connect-wallet";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Upload & Compare",
  description: "Upload and compare PDF files with Web3 integration",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
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
                    <a
                      href="/"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Home
                    </a>
                    <a
                      href="/compare"
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Compare PDFs
                    </a>
                    <ConnectWallet />
                  </nav>
                </div>
              </div>
            </header>
            {children}
            {/* Footer */}
            <footer className="bg-white border-t mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-500">
                  <p>&copy; 2025 PDF Upload. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </WagmiProviders>
      </body>
    </html>
  );
}
