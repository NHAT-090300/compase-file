"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useConnect } from "wagmi";
import { useGlobalModal } from "./modal-provider";

interface Props {}

export const ConnectWalletModal = ({}: Props) => {
  const { closeModal } = useGlobalModal();
  const { connect, connectors, isPending } = useConnect();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => {
              connect({ connector });
              closeModal();
            }}
            disabled={isPending}
            className="cursor-pointer"
          >
            <Wallet className="h-4 w-4 mr-2" />
            {connector.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
