"use client";

import { Button } from "@/components/ui/button";
import { testnet } from "@/lib/wagmi";
import { useSwitchChain } from "wagmi";
import { useGlobalModal } from "./modal-provider";

interface Props {}

export const SwitchModal = ({}: Props) => {
  const { closeModal } = useGlobalModal();
  const { chains, switchChain } = useSwitchChain();

  const accept = () => {
    switchChain({ chainId: testnet.id });
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={closeModal}>
          Quay lại
        </Button>
        <Button onClick={accept}>Xác nhận</Button>
      </div>
    </div>
  );
};
