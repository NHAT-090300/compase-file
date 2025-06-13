"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, FolderUp, FileText, Plus } from "lucide-react";
import { generateFileId, getFileType } from "@/lib/file";
import { FileItem } from "@/types/file";

interface FileUploadProps {
  onFilesUploaded: (files: FileItem[]) => void;
  mobile?: boolean;
  disabled?: boolean;
}

export function FileUpload({
  onFilesUploaded,
  mobile = false,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (fileList: FileList) => {
      const files: FileItem[] = Array.from(fileList).map((file) => ({
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: getFileType(file.name),
        uploadDate: new Date(),
        url: URL.createObjectURL(file),
        file: file,
      }));

      onFilesUploaded(files);
    },
    [onFilesUploaded]
  );

  const handleFileSelect = useCallback(
    (multiple = true, directory = false) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = multiple;
      if (directory) {
        input.webkitdirectory = true;
      }

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          processFiles(target.files);
        }
      };

      input.click();
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (mobile) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={disabled}
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleFileSelect(true, false)}>
              <FileText className="w-4 h-4 mr-2" />
              Tải tệp lên
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect(true, true)}>
              <FolderUp className="w-4 h-4 mr-2" />
              Tải thư mục lên
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Drag and Drop Overlay */}
        {isDragging && (
          <div
            className="fixed inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 z-50 flex items-center justify-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg text-center mx-4">
              <Upload className="w-10 h-10 mx-auto mb-3 text-blue-500" />
              <p className="text-base font-semibold">Thả file vào đây</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Chọn tài liệu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleFileSelect(true, false)}>
            <FileText className="w-4 h-4 mr-2" />
            Tải tệp lên
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFileSelect(true, true)}>
            <FolderUp className="w-4 h-4 mr-2" />
            Tải thư mục lên
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Desktop Drag and Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 z-50 flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-semibold">Thả file vào đây để upload</p>
          </div>
        </div>
      )}

      {/* Hidden drop zone for the entire page */}
      <div
        className="fixed inset-0 pointer-events-none"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />
    </>
  );
}
