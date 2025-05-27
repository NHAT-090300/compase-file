"use client";

import { FormEvent, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, FileText, Upload } from "lucide-react";
import { If } from "@/components/custom/condition";
import { createHash } from "crypto";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  hash: string;
  lastModified: string;
}

export const abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "write",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function Component() {
  const { writeContractAsync } = useWriteContract();
  const { isConnected } = useAccount();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "risegate.io" && password === "risegate@2025") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  async function generateHashFromArrayBuffer(
    buffer: ArrayBuffer
  ): Promise<`0x${string}`> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return `0x${hashHex}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setUploadResult(null);

    if (!isConnected) {
      setError("Vui lòng kết nối Ví Web3 để được tiếp tục.");
      return;
    }

    if (!selectedFile) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    try {
      setUploading(true);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const hash = await generateHashFromArrayBuffer(arrayBuffer);

      await writeContractAsync({
        abi,
        address: "0x2d6197eB987Fb12DE6dFea2eA7Ca5D7a50b20D09",
        functionName: "write",
        args: [hash],
      });

      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
      } else {
        setError("Tải lên thất bại. Vui lòng thử lại.");
      }

      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Đã xảy ra lỗi trong quá trình tải lên.");
      setUploading(false);
    }
  };

  return (
    <main className="relative pb-16">
      <If
        condition={!isAuthenticated}
        Then={
          <div
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-start py-40 z-50"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <form
              onSubmit={handleLogin}
              className="bg-white rounded-md p-6 w-96 shadow-lg flex-shrink-0 h-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

              <Input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="mb-4"
              />

              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              {loginError && (
                <p className="text-red-600 mb-4 text-sm text-left">
                  {loginError}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Đăng nhập
              </Button>
            </form>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tải File Tài Liệu Bạn Muốn Phát Hành (PDF)
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống trích xuất "sinh trắc học" tài liệu và lưu trữ blockchain
            phục vụ xác minh bản gốc
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Tải tài liệu PDF
            </CardTitle>
            <CardDescription>
              Chọn một tệp PDF để tải lên. Kích thước tệp tối đa: 100MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="pdf"
                  className="text-sm font-medium text-gray-700"
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
              <Button type="submit" disabled={uploading} className="w-full">
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
            </form>

            {/* Success Message */}
            {uploadResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      Tải lên thành công!
                    </h3>
                    <p className="text-sm text-green-700 mt-1">{`Tệp "${
                      uploadResult.name
                    }" (${(uploadResult.size / 1024 / 1024).toFixed(
                      2
                    )} MB) đã được tải lên thành công!`}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <div className="h-5 w-5 text-red-600 mr-2">⚠</div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Tải lên thất bại
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hỗ trợ PDF
            </h3>
            <p className="text-gray-600">
              Tải lên các tệp PDF có kích thước tối đa 100MB với hỗ trợ đầy đủ
              định dạng.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tải lên an toàn
            </h3>
            <p className="text-gray-600">
              Các tệp của bạn được tải lên một cách an toàn với mã hóa và kiểm
              tra xác thực.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xử lý nhanh chóng
            </h3>
            <p className="text-gray-600">
              Tải lên nhanh chóng kèm theo cập nhật trạng thái theo thời gian
              thực.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
