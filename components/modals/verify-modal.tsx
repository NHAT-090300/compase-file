import { generateHashFromFile } from "@/lib/utils";
import { IDocument } from "@/types/document";
import { CheckCircle, GitCompare, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useGlobalModal } from "./modal-provider";

interface Props {
  document: IDocument;
}

interface ComparisonResult {
  isMatch: boolean;
  details: {
    nameMatch: boolean;
    hashMatch: boolean;
    file1Info: { name: string; hash: string };
    file2Info: { name: string; hash: string };
  };
}

export const VerifyModal = ({ document }: Props) => {
  const { closeModal } = useGlobalModal();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handelCompare = async () => {
    if (!selectedFile || !document) {
      setError("Vui lòng chọn một tệp tài liệu.");
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("Kích thước tệp vượt quá giới hạn 100MB.");
      return;
    }

    try {
      setComparing(true);
      setError(null);
      setComparisonResult(null);

      const hash = await generateHashFromFile(selectedFile);

      const hashMatch = document.documentHash === hash;
      const nameMatch = document.fileName === selectedFile.name;

      setComparisonResult({
        isMatch: hashMatch && nameMatch,
        details: {
          nameMatch,
          hashMatch,
          file1Info: { name: document.fileName, hash: document.documentHash },
          file2Info: { name: selectedFile.name, hash },
        },
      });
    } catch (error) {
      console.error("Comparison error:", error);
      setComparisonResult(null);
      setError("Đã xảy ra lỗi trong quá trình kiểm tra.");
    } finally {
      setComparing(false);
    }
  };

  return (
    <form onSubmit={handelCompare}>
      <div className="grid gap-4 py-3">
        <label htmlFor="pdf2" className="text-sm font-medium text-gray-700">
          Chọn tệp PDF
        </label>
        <Input
          disabled={comparing}
          onChange={handleFileChange}
          id="pdf2"
          name="pdf2"
          type="file"
          accept="application/pdf"
          required
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 h-auto"
        />

        {/* Comparison Result */}
        {comparisonResult && (
          <div className="space-y-4">
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
                <h5 className="font-medium text-blue-900 mb-2">Tài liệu gốc</h5>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Tên:</strong>{" "}
                    {comparisonResult.details.file1Info.name}
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
                    <strong>"Sinh trắc học" của tài liệu:</strong>{" "}
                    <p>
                      {comparisonResult.details.file2Info.hash.substring(0, 16)}
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
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
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button
          type="button"
          disabled={comparing}
          onClick={closeModal}
          variant="outline"
        >
          Hủy
        </Button>

        <Button type="submit" disabled={comparing} onClick={handelCompare}>
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
      </div>
    </form>
  );
};
