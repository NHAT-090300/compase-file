"use client";

import { FormEvent, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useReadContract } from "wagmi";
// import { parseBytes32String } from "ethers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, CheckCircle, XCircle, GitCompare } from "lucide-react";

interface ComparisonResult {
  isMatch: boolean;
  details: {
    nameMatch: boolean;
    hashMatch: boolean;
    file1Info: {
      name: string;
      size: number;
      hash: string;
    };
    file2Info: {
      name: string;
      size: number;
      hash: string;
    };
  };
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: string;
}

export const abi = [
  {
    inputs: [],
    name: "read",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function ComparePage() {
  const result = useReadContract({
    abi,
    address: "0x2d6197eB987Fb12DE6dFea2eA7Ca5D7a50b20D09",
    functionName: "read",
  });
  const originalHash = result.data;

  const [fileOriginal, setFileOriginal] = useState<FileInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileOrigin = async () => {
    try {
      setError(null);
      const res = await fetch("/api/upload");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể lấy thông tin tệp.");
      } else {
        setFileOriginal(data);
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy thông tin tệp.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handelCompare = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile || !originalHash) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    try {
      setComparing(true);
      setError(null);
      setComparisonResult(null);

      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("originalHash", originalHash);

      const response = await fetch("/api/compare", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setComparisonResult(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Đã xảy ra lỗi trong quá trình kiểm tra.");
      }
    } catch (error) {
      console.error("Comparison error:", error);
      setError("Đã xảy ra lỗi trong quá trình kiểm tra.");
    } finally {
      setComparing(false);
    }
  };

  useEffect(() => {
    getFileOrigin();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Xác thực tài liệu
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tải file cần xác thực để đối chiếu "Sinh trắc học" với bản gốc
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
          <form onSubmit={handelCompare} className="space-y-6">
            <div className="grid grid-cols-1  gap-6">
              {/* <div className="space-y-2">
                <label
                  htmlFor="pdf1"
                  className="text-sm font-medium text-gray-700"
                >
                  PDF File original
                </label>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {fileOriginal && (
                    <div>
                      <ul className="text-sm">
                        <li>
                          <strong>Name:</strong> {fileOriginal.name}
                        </li>
                        <li>
                          <strong>Size:</strong>{" "}
                          {(fileOriginal.size / 1024 / 1024).toFixed(2)} MB
                        </li>
                        <li>
                          <strong>Type:</strong> {fileOriginal.type}
                        </li>
                        <li>
                          <strong>Last Modified:</strong>{" "}
                          {dayjs(fileOriginal.lastModified).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </li>
                        <li>
                          <strong>Hash: </strong>
                          {originalHash}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div> */}
              <div className="space-y-2">
                <label
                  htmlFor="pdf2"
                  className="text-sm font-medium text-gray-700"
                >
                  Chọn tệp PDF
                </label>
                <Input
                  onChange={handleFileChange}
                  id="pdf2"
                  name="pdf2"
                  type="file"
                  accept="application/pdf"
                  required
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 h-auto"
                />
              </div>
            </div>
            <Button type="submit" disabled={comparing} className="w-full">
              {comparing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang so sánh các tệp...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Xác minh tài liệu
                </>
              )}
            </Button>
          </form>
          {/* Comparison Result */}
          {comparisonResult && (
            <div className="mt-6 space-y-4">
              {/* Overall Result */}
              <div
                className={`p-4 border rounded-md ${
                  comparisonResult.isMatch
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {comparisonResult.isMatch ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        comparisonResult.isMatch
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {comparisonResult.isMatch
                        ? "Tài liệu này là bản gốc"
                        : "Tài liệu này không phải bản gốc"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        comparisonResult.isMatch
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {comparisonResult.isMatch
                        ? "Tài liệu được kiểm tra hoàn toàn giống nhau."
                        : "Tài liệu được kiểm tra có sự khác biệt với tài liệu gốc."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="bg-white border rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  So sánh chi tiết
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tên tài liệu:</span>
                    <div className="flex items-center">
                      {comparisonResult.details.nameMatch ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`ml-2 text-sm ${
                          comparisonResult.details.nameMatch
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {comparisonResult.details.nameMatch
                          ? "Khớp"
                          : "Không khớp"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      "Sinh trắc học" của tài liệu:
                    </span>
                    <div className="flex items-center">
                      {comparisonResult.details.hashMatch ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`ml-2 text-sm ${
                          comparisonResult.details.hashMatch
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {comparisonResult.details.hashMatch
                          ? "Khớp"
                          : "Không khớp"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Tài liệu gốc
                  </h5>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <strong>Tên:</strong>{" "}
                      {comparisonResult.details.file1Info.name}
                    </p>
                    <p>
                      <strong>Kích thước:</strong>{" "}
                      {(
                        comparisonResult.details.file1Info?.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                    <p>
                      <strong>"Sinh trắc học" của tài liệu:</strong>{" "}
                      <p>
                        {comparisonResult.details.file1Info?.hash.substring(
                          0,
                          16
                        )}
                        ...
                      </p>
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h5 className="font-medium text-green-900 mb-2">
                    Tài liệu được kiểm tra
                  </h5>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Tên:</strong>{" "}
                      {comparisonResult.details.file2Info.name}
                    </p>
                    <p>
                      <strong>Kích thước:</strong>{" "}
                      {(
                        comparisonResult.details.file2Info.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                    <p>
                      <strong>"Sinh trắc học" của tài liệu:</strong>{" "}
                      <p>
                        {comparisonResult.details.file2Info.hash.substring(
                          0,
                          16
                        )}
                        ...
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Kiểm tra thất bại
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it Works Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Cách thức Kiểm tra tài liệu hoạt động như thế nào
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              1. Tải tài liệu
            </h4>
            <p className="text-gray-600">
              Chọn và tải lên tài liệu bạn muốn kiểm tra từ thiết bị của mình.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <GitCompare className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              2. Phân tích
            </h4>
            <p className="text-gray-600">
              Chúng tôi phân tích tên tệp, kích thước và "Sinh trắc học" của tài
              liệu để so sánh.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              3. Kết quả
            </h4>
            <p className="text-gray-600">
              Nhận kết quả kiểm tra chi tiết, hiển thị những điểm giống và khác
              nhau.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
