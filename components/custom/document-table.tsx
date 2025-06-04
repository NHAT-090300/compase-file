"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { readContract } from "@wagmi/core";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { documentAbi } from "@/lib/abi";
import { splitText } from "@/lib/utils";
import { config } from "@/lib/wagmi";
import { IDocument } from "@/types/document";
import { isNumber } from "lodash";
import { useAccount } from "wagmi";
import { LoginModal } from "../modals/login-modal";
import { useGlobalModal } from "../modals/modal-provider";
import { UpdateModal } from "../modals/update-modal";
import { UploadModal } from "../modals/upload-modal";
import { VerifyModal } from "../modals/verify-modal";
import { If } from "./condition";

const itemsPerPage = 10;

export function DocumentTable() {
  const { address } = useAccount();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [totalData, setTotalData] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<IDocument[]>([]);
  const { openModal } = useGlobalModal();

  const handleUpdate = async (document: IDocument) => {
    openModal({
      title: "Cập nhập tài liệu",
      description:
        " Chọn một tệp PDF để tải lên. Kích thước tệp tối đa: 100MB.",
      body: <UpdateModal document={document} onSuccess={fetchDocuments} />,
    });
  };

  const handleVerify = async (document: IDocument) => {
    openModal({
      title: "Xác thực tài liệu",
      description:
        " Chọn một tệp PDF để tải lên. Kích thước tệp tối đa: 100MB.",
      body: <VerifyModal document={document} />,
    });
  };

  const columns: ColumnDef<IDocument>[] = [
    {
      accessorKey: "name",
      header: "Tên hồ sơ",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "fileName",
      header: "Tên file",
      cell: ({ row }) => <div>{row.getValue("fileName")}</div>,
    },
    {
      accessorKey: "documentHash",
      header: "Hash",
      cell: ({ row }) => (
        <div className="capitalize">
          {splitText(row.getValue("documentHash"), 5)}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const document = row.original;

        return (
          <div className="flex items-center gap-2 justify-end">
            <If
              condition={
                Boolean(address && document.owner) &&
                address?.toLowerCase() === document.owner?.toLowerCase()
              }
              Then={
                <Button
                  onClick={() => handleUpdate(document)}
                  variant="outline"
                >
                  Cập nhập
                </Button>
              }
            />
            <Button onClick={() => handleVerify(document)} variant="outline">
              Xác thực
            </Button>
          </div>
        );
      },
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

  const handleUpload = () => {
    if (!isLoggedIn) {
      openModal({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để tiếp tục.",
        body: (
          <LoginModal
            onSuccess={() => {
              openModal({
                title: " Tải tài liệu PDF",
                description:
                  "Chọn một tệp PDF để tải lên. Kích thước tệp tối đa: 100MB.",
                body: <UploadModal onSuccess={fetchDocuments} />,
              });
            }}
          />
        ),
      });
      return;
    }

    openModal({
      title: " Tải tài liệu PDF",
      description: "Chọn một tệp PDF để tải lên. Kích thước tệp tối đa: 100MB.",
      body: <UploadModal onSuccess={fetchDocuments} />,
    });
  };

  const getDocument = async (id: number) => {
    try {
      const result = await readContract(config, {
        abi: documentAbi,
        address: "0xfc27D9F25F5433068B00624808b15B8b5D449508",
        functionName: "read",
        args: [id],
      });

      const file = result as IDocument;
      return { ...file, id };
    } catch (error) {
      return null;
    }
  };

  const getDocuments = async (currentPage: number, totalDocument: number) => {
    try {
      const startId = (currentPage - 1) * itemsPerPage + 1;
      const endId = Math.min(startId + itemsPerPage - 1, totalDocument);

      const ids = Array.from(
        { length: endId - startId + 1 },
        (_, i) => startId + i
      );

      const promises = ids.map(getDocument);
      const result = await Promise.all(promises);
      const documents = result.filter((item) => item !== null);
      setData(documents);
    } catch (error) {
      setData([]);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const result = await readContract(config, {
        abi: documentAbi,
        address: "0xfc27D9F25F5433068B00624808b15B8b5D449508",
        functionName: "getTotalSlot",
      });

      const totalDocument = isNumber(Number(result)) ? Number(result) : 0;
      setTotalData(totalDocument);
      setPage(1);
      getDocuments(1, totalDocument);
    } catch (error) {
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handlePrev = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    getDocuments(newPage, totalData);
  };
  const handleNext = () => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
    getDocuments(newPage, totalData);
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="w-full">
      <div className="flex gap-2 py-4 justify-end">
        {/* <div className="flex-1 flex items-center gap-2">
          <Button variant="default">Tất cả</Button>
          <Button variant="outline">Của tôi</Button>
        </div> */}
        <Button onClick={handleUpload} variant="outline">
          Phát hành tài liệu
        </Button>
      </div>
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
    </div>
  );
}
