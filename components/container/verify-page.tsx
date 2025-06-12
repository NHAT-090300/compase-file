import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle, CheckCircle, FileCheck } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
import { generateHashFromFile } from "@/lib/utils";
import { readContract } from "@wagmi/core";
import { documentAbi } from "@/lib/abi";
import { config, documentWalletAddress } from "@/lib/wagmi";
import { isArray } from "lodash";
import { IDocument } from "@/types/document";

interface VerificationResult {
  filename: string;
  hash: string;
  isVerified: boolean;
  matchDocuments: IDocument[];
}

export const VerifyPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [verificationResults, setVerificationResults] = useState<
    VerificationResult[]
  >([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? [...e.target.files] : [];

    setSelectedFiles(files);
  };

  const getDocument = async (id: number) => {
    try {
      const result = await readContract(config, {
        abi: documentAbi,
        address: documentWalletAddress,
        functionName: "read",
        args: [id],
      });

      const file = result as IDocument;

      return { ...file, id };
    } catch (error) {
      return null;
    }
  };

  const verifyFile = async (file: File) => {
    const hash = await generateHashFromFile(file);

    const response = await readContract(config, {
      abi: documentAbi,
      address: documentWalletAddress,
      functionName: "getIdByHash",
      args: [hash],
    });

    const ids = isArray(response) ? response.map((id) => Number(id)) : [];
    const documents = await Promise.all(ids.map((id) => getDocument(id)));
    const matchDocuments = documents.filter((item) => item !== null);

    return {
      filename: file.name,
      hash,
      isVerified: matchDocuments.length > 0,
      matchDocuments,
    } as VerificationResult;
  };

  // Xác thực files
  const handleVerifyFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Vui lòng chọn file để xác thực");
      return;
    }

    setIsVerifying(true);

    try {
      const results = await Promise.all(selectedFiles.map(verifyFile));
      setVerificationResults(results);
      toast.success("Xác thực hoàn tất");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác thực tài liệu");
    } finally {
      setIsVerifying(false);
      if (verifyInputRef.current) verifyInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Xác thực File
          </CardTitle>
          <CardDescription>
            Chọn file để xác thực tính toàn vẹn bằng cách so sánh mã hash với
            database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verify-upload">Chọn file để xác thực</Label>
            <Input
              id="verify-upload"
              type="file"
              multiple
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-auto"
              disabled={isVerifying}
              onChange={handleFileChange}
            />
          </div>

          <Button
            onClick={handleVerifyFiles}
            disabled={isVerifying || selectedFiles.length === 0}
            className="w-full"
          >
            {isVerifying ? "Đang xác thực..." : "Xác thực File"}
          </Button>
        </CardContent>
      </Card>

      {/* Kết quả xác thực */}
      {verificationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Xác thực</CardTitle>
            <CardDescription>
              {verificationResults.filter((r) => r.isVerified).length}/
              {verificationResults.length} file được xác thực thành công
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{result.filename}</h4>
                    <Badge
                      variant={result.isVerified ? "default" : "destructive"}
                    >
                      {result.isVerified ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Đã xác thực
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" /> Không tìm
                          thấy
                        </>
                      )}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    Hash:{" "}
                    <span className="font-mono">
                      {result.hash.substring(0, 32)}...
                    </span>
                  </p>

                  {/* Trong phần hiển thị kết quả xác thực, thay thế phần hiển thị match: */}
                  {result.isVerified && result.matchDocuments.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 space-y-2">
                      <p className="text-sm text-green-800 font-medium">
                        <strong>
                          Tìm thấy {result.matchDocuments.length} tài liệu khớp:
                        </strong>
                      </p>
                      <div className="space-y-2">
                        {result.matchDocuments.map((record, recordIndex) => (
                          <div
                            key={record.id}
                            className="bg-white border border-green-300 rounded p-2"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-green-900">
                                  {record.name}
                                </p>
                                <p className="text-xs text-green-700">
                                  File gốc: {record.fileName}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                #{recordIndex + 1}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!result.isVerified && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-800">
                        Không có tài liệu nào trùng khớp
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
