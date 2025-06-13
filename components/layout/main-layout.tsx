"use client";

import { testnet } from "@/lib/wagmi";
import { PropsWithChildren, useEffect } from "react";
import { useAccount } from "wagmi";
import Footer from "../custom/footer";
import Header from "../custom/header";
import { useGlobalModal } from "../modals/modal-provider";
import { SwitchModal } from "../modals/switch-modal";
import { ConnectWalletModal } from "../modals/connect-wallet-modal";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { address, isConnected, chain } = useAccount();
  const { openModal } = useGlobalModal();

  const switchChain = async () => {
    openModal({
      title: "Chuyển mạng",
      description: "Bạn cần chuyển mạng để thực hiện thao tác này",
      body: <SwitchModal />,
    });
  };

  const connectWallet = async () => {
    openModal({
      title: "Kết nối ví",
      description: "Bạn cần kết nối ví để thực hiện thao tác này",
      body: <ConnectWalletModal />,
    });
  };

  useEffect(() => {
    if (isConnected && chain?.id !== testnet?.id) {
      switchChain();
    }

    if (!isConnected || !address) {
      connectWallet();
    }

    console.log({ isConnected, address, chain });
  }, [isConnected, chain, address]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-[80vh] relative">{children}</div>
      <Footer />
    </div>
  );
};
