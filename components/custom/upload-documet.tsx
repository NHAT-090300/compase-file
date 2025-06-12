import { CheckCircle, File, FileText, Trash2, Upload } from "lucide-react";
import React, { useState } from "react";
import { useAccount } from "wagmi";

import { documentAbi } from "@/lib/abi";
import { generateHashFromMultipleFile } from "@/lib/utils";
import { config, documentWalletAddress } from "@/lib/wagmi";
import { FileItem } from "@/types/file";
import { waitForTransaction, writeContract } from "@wagmi/core";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { FileUpload } from "./file-upload";

export const UploadDocument = () => {
  const { isConnected } = useAccount();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

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

    if (name.length > 150) {
      setError("Vui lòng nhập tên hồ sơ dưới 150 ký tự.");
      return;
    }

    if (!files.length) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    // const maxSize = 100 * 1024 * 1024;
    // if (selectedFile.size > maxSize) {
    //   setError("Kích thước tệp vượt quá giới hạn 100MB.");
    //   return;
    // }

    try {
      setUploading(true);

      const documents = files.map((item) => item.file);
      const names = Array(files.length).fill(name);
      const documentsName = files.map((file) => file.name);
      const documentsHash = await generateHashFromMultipleFile(documents);

      const hash = await writeContract(config, {
        abi: documentAbi,
        address: documentWalletAddress,
        functionName: "batchWrite",
        args: [names, documentsName, documentsHash],
      });

      await waitForTransaction(config, { hash });

      setError(null);
      setFiles([]);
      setName("");

      setUploadSuccess(true);
      setUploading(false);
      toast.success("Phát hành tài liệu thành công");
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình tải lên.");
      setUploading(false);
      setUploadSuccess(false);
    }
  };
  const handleChangeFiles = (newFiles: FileItem[]) => {
    setError(null);

    const maxSize = 100 * 1024 * 1024;

    const documents: FileItem[] = [];

    newFiles.forEach((document) => {
      if (document.size > maxSize) return;
      documents.push(document);
    });

    setFiles(documents);
  };

  const onDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
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
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Chọn tệp
          </label>

          <FileUpload onFilesUploaded={handleChangeFiles} />
        </div>

        <div className="pr-1.5 max-h-56 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 mb-1.5 hover:bg-muted rounded-lg group cursor-pointer"
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
                  <File className="w-6 h-6 text-gray-500" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-medium truncate">
                  {file.name}
                </p>
              </div>

              <button
                disabled={uploading}
                onClick={() => onDeleteFile(file.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
              </button>
            </div>
          ))}
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

        <Button type="submit" disabled={uploading} onClick={handleUpload}>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 mr-2" />
              Tải lên tài liệu
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
