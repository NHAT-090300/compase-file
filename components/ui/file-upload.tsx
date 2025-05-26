"use client";

import { Upload } from "lucide-react";
import React, { useState, useRef, DragEvent } from "react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  customText?: string;
}

export default function FileUpload({
  onFileChange,
  accept = ".pdf",
  maxSizeMB = 10,
  customText = "Kéo và thả tệp PDF vào đây, hoặc nhấp để chọn tệp.",
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (accept && !file.name.toLowerCase().endsWith(accept.replace(".", ""))) {
      alert(`Chỉ cho phép các tệp ${accept}.`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Kích thước tệp phải nhỏ hơn ${maxSizeMB} MB.`);
      return;
    }
    setFileName(file.name);
    onFileChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-8 cursor-pointer transition
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-500"
          }
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          ref={inputRef}
        />

        <Upload className="h-12 w-12 mb-2" />

        <p className="text-gray-600">{fileName || customText}</p>
      </label>
    </div>
  );
}
