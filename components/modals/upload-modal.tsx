"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documentAbi } from "@/lib/abi";
import { generateHashFromFile } from "@/lib/utils";
import { config } from "@/lib/wagmi";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { CheckCircle, Upload } from "lucide-react";
import { useGlobalModal } from "./modal-provider";

interface Props {
  onSuccess: () => Promise<void>;
}

export const UploadModal = ({ onSuccess }: Props) => {
  const { isConnected } = useAccount();
  const { closeModal } = useGlobalModal();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleUpload = async () => {
    setError(null);
    setUploadSuccess(false);

    if (!isConnected) {
      setError("Vui lòng kết nối Ví Web3 để được tiếp tục.");
      return;
    }

    if (!name) {
      setError("Vui lòng nhập tên hồ sơ.");
      return;
    }

    if (!selectedFile) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("Kích thước tệp vượt quá giới hạn 100MB.");
      return;
    }

    try {
      setUploading(true);

      const documentHash = await generateHashFromFile(selectedFile);

      const hash = await writeContract(config, {
        abi: documentAbi,
        address: "0xfc27D9F25F5433068B00624808b15B8b5D449508",
        functionName: "write",
        args: [name, selectedFile.name, documentHash],
      });

      await waitForTransaction(config, { hash });

      setUploadSuccess(true);
      setUploading(false);
      toast.success("Phát hành tài liệu thành công");
      onSuccess();
      closeModal();
    } catch (error) {
      console.error("Upload error:", error);
      setError("Đã xảy ra lỗi trong quá trình tải lên.");
      setUploading(false);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-1 text-gray-700"
        >
          Tên hồ sơ
        </label>
        <Input
          title="Tên hồ sơ"
          onChange={handleChangeName}
          value={name}
          id="name"
          name="name"
          required
          disabled={uploading}
        />
      </div>

      <div>
        <label
          htmlFor="pdf"
          className="block text-sm mb-1 font-medium text-gray-700"
        >
          Chọn tệp PDF
        </label>
        <Input
          onChange={handleFileChange}
          id="pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          required
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-auto"
          disabled={uploading}
        />
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Phát hành tài liệu thành công
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <div className="h-5 w-5 text-red-600 mr-2">⚠</div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Phát hành tài liệu thất bại
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={closeModal}>
          Đóng
        </Button>
        <Button type="submit" disabled={uploading} onClick={handleUpload}>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Tải lên PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
