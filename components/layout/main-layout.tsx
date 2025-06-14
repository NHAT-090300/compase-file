"use client";

import { PropsWithChildren } from "react";
import Footer from "../custom/footer";
import Header from "../custom/header";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-[80vh] relative">{children}</div>
      <Footer />
    </div>
  );
};
