"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Router from "next/router";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import NavLink from "../custom/nav-link";
import { ConnectWallet } from "../wallet/connect-wallet";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-6">
          {/* Logo */}
          <div
            className="flex items-center gap-2"
            onClick={() => Router.push("/")}
          >
            <Image width={48} height={48} src="/logo-danang.png" alt="logo" />
            <h1 className="hidden md:block text-lg xl:text-2xl font-bold text-gray-900 ml-2">
              Sở Khoa học và Công nghệ TP Đà Nẵng
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/">Xác thực tài liệu</NavLink>
            <NavLink href="/upload">Phát hành tài liệu</NavLink>
            <NavLink href="/guide">Hướng dẫn</NavLink>
            <ConnectWallet />
          </nav>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger aria-label="Open menu">
                <Menu size={28} />
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80">
                <div className="mt-6 space-y-4 grid grid-cols-1 gap-4">
                  <SheetClose asChild>
                    <NavLink href="/">Xác thực tài liệu</NavLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavLink href="/upload">Phát hành tài liệu</NavLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavLink href="/guide">Hướng dẫn</NavLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <ConnectWallet />
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
