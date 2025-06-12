import React, { PropsWithChildren } from "react";
import Header from "../custom/header";
import Footer from "../custom/footer";

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
