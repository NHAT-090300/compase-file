"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";

export default function Component() {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setUploading(true);
      setError(null);
      setUploadResult(null);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.text();
        setUploadResult(result);
      } else {
        setError("Upload failed. Please try again.");
      }
      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred during upload.");
      setUploading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your PDF Files
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Easily upload and manage your PDF documents. Select a file from your
          device and upload it securely.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload PDF File
          </CardTitle>
          <CardDescription>
            Choose a PDF file to upload. Maximum file size: 10MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="pdf"
                className="text-sm font-medium text-gray-700"
              >
                Select PDF File
              </label>
              <Input
                id="pdf"
                name="pdf"
                type="file"
                accept="application/pdf"
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-auto"
              />
            </div>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
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
                    Upload Successful!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">{uploadResult}</p>
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
                    Upload Failed
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
            PDF Support
          </h3>
          <p className="text-gray-600">
            Upload PDF files up to 10MB in size with full format support.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure Upload
          </h3>
          <p className="text-gray-600">
            Your files are uploaded securely with encryption and validation.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fast Processing
          </h3>
          <p className="text-gray-600">
            Quick upload processing with real-time status updates.
          </p>
        </div>
      </div>
    </main>
  );
}
