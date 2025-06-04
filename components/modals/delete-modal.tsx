"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { documentAbi } from "@/lib/abi";
import { config, documentWalletAddress } from "@/lib/wagmi";
import { IDocument } from "@/types/document";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGlobalModal } from "./modal-provider";

interface Props {
  document: IDocument;
  onSuccess: () => void;
}

export const DeleteModal = ({ document, onSuccess }: Props) => {
  const { closeModal } = useGlobalModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);

      const hash = await writeContract(config, {
        abi: documentAbi,
        address: documentWalletAddress,
        functionName: "changeStatus",
        args: [false, Number(document.id)],
      });

      await waitForTransaction(config, { hash });

      toast.success("Xóa tài liệu thành công");
      setLoading(false);
      onSuccess();
      closeModal();
    } catch (error) {
      console.log(error);
      setError("Đã xảy ra lỗi trong quá trình xóa tài liệu.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <Button disabled={loading} variant="outline" onClick={closeModal}>
          Quay lại
        </Button>
        <Button disabled={loading} onClick={handleDelete}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang xóa...
            </>
          ) : (
            <>Xác nhận</>
          )}
        </Button>
      </div>
    </div>
  );
};
