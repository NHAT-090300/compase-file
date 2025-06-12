"use client";

import React, { FormEvent, useState } from "react";
import { isArray } from "lodash";
import { readContract } from "@wagmi/core";
import { CheckCircle, GitCompare, Upload, XCircle } from "lucide-react";
import { isNumber } from "lodash";

import { documentAbi } from "@/lib/abi";
import { generateHashFromFile } from "@/lib/utils";
import { config, documentWalletAddress } from "@/lib/wagmi";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { If } from "./condition";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { splitText } from "@/lib/utils";
import { IDocument } from "@/types/document";

const itemsPerPage = 10;

function DocumentTable({ matchIds }: { matchIds: number[] }) {
  const [loading, setLoading] = React.useState(true);
  const [totalData, setTotalData] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<IDocument[]>([]);

  const columns: ColumnDef<IDocument>[] = [
    {
      accessorKey: "name",
      header: "Tên hồ sơ",
      cell: ({ row }) => (
        <div className="line-clamp-2 max-w-64">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "fileName",
      header: "Tên file",
      cell: ({ row }) => (
        <div className="line-clamp-2 max-w-62">{row.getValue("fileName")}</div>
      ),
    },
    {
      accessorKey: "documentHash",
      header: '"Sinh trắc học" của tài liệu',
      cell: ({ row }) => (
        <div className="capitalize w-52">
          {splitText(row.getValue("documentHash"), 3)}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Địa chỉ ví người phát hành",
      cell: ({ row }) => (
        <div className="capitalize w-52">
          {splitText(row.getValue("owner"), 3)}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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

  const getDocuments = async (currentPage = 1) => {
    setLoading(true);
    try {
      console.log("getPagination");
      const response = (await readContract(config, {
        abi: documentAbi,
        address: documentWalletAddress,
        functionName: "getPagination",
        args: [currentPage, itemsPerPage, matchIds],
      })) as [number[], number];

      const ids = isArray(response?.[0]) ? response[0] : [];
      const total = response?.[1] ? Number(response[1]) : 0;

      setPage(currentPage);
      setTotalData(isNumber(total) ? total : 0);

      const promises = ids.map((id) => getDocument(Number(id)));
      const result = await Promise.all(promises);
      const documents = result.filter((item) => item !== null);
      setData(documents);
    } catch (error) {
      setPage(1);
      setData([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handlePrev = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    getDocuments(newPage);
  };
  const handleNext = () => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    getDocuments(newPage);
  };

  React.useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <If
              condition={loading}
              Then={
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              }
              Else={
                table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )
              }
            />
          </TableBody>
        </Table>
      </div>
      <If
        condition={totalPages > 1}
        Then={
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              Trang: {page}/{totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={page === 1}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Trang sau
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

interface ComparisonResult {
  isMatch: boolean;
  name: string;
  hash: string;
  size: number;
}

export const VerifyDocument = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [matchIds, setMatchIds] = useState<number[]>([]);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handelCompare = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      setComparing(true);
      setComparisonResult(null);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const verifyHash = await generateHashFromFile(selectedFile);

      const response = await readContract(config, {
        abi: documentAbi,
        address: documentWalletAddress,
        functionName: "getIdByHash",
        args: [verifyHash],
      });

      const ids = isArray(response) ? response.map((id) => Number(id)) : [];

      setMatchIds(ids);
      setComparisonResult({
        isMatch: ids.length > 0,
        name: selectedFile.name,
        size: selectedFile.size,
        hash: verifyHash,
      });
    } catch (error) {
      setMatchIds([]);
      setError("Đã xảy ra lỗi trong quá trình kiểm tra.");
    } finally {
      setComparing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Tải tài liệu xác thực
          </CardTitle>
          <CardDescription>
            Chọn tệp để tải lên. Kích thước tệp tối đa: 100MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handelCompare} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="pdf2"
                  className="text-sm font-medium text-gray-700"
                >
                  Chọn tệp
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

          {comparisonResult && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h5 className="font-medium text-green-900 mb-2">
                  Tài liệu được kiểm tra
                </h5>
                <div className="space-y-1 text-sm text-green-800">
                  <p className="flex items-center gap-1">
                    <strong>Tên:</strong>
                    {comparisonResult?.name}
                  </p>
                  <p className="flex items-center gap-1">
                    <strong>"Sinh trắc học" của tài liệu:</strong>
                    <p>{splitText(comparisonResult?.hash, 3)}</p>
                  </p>
                </div>
              </div>

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
                        ? `Tài liệu này khớp với ${matchIds.length} tài liệu`
                        : "Không có tài liệu nào trùng khớp"}
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

      <If
        condition={matchIds.length > 0}
        Then={
          <div className="py-3">
            <DocumentTable matchIds={matchIds} />
          </div>
        }
      />
    </>
  );
};
