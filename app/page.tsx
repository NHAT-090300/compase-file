"use client";

import { DocumentTable } from "@/components/custom/document-table";

export default function ComparePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Xác thực tài liệu
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tải file cần xác thực để đối chiếu "Sinh trắc học" với bản gốc
        </p>
      </div>

      <DocumentTable />
    </main>
  );
}
