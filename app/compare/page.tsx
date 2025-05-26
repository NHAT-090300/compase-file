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
import { Upload, CheckCircle, XCircle, GitCompare } from "lucide-react";

interface ComparisonResult {
  isMatch: boolean;
  details: {
    nameMatch: boolean;
    sizeMatch: boolean;
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

export default function ComparePage() {
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setComparing(true);
      setError(null);
      setComparisonResult(null);

      const response = await fetch("/api/compare", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setComparisonResult(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Comparison failed. Please try again.");
      }
    } catch (error) {
      console.error("Comparison error:", error);
      setError("An error occurred during comparison.");
    } finally {
      setComparing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Compare PDF Files
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload two PDF files to compare and check if they are identical or
          different.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitCompare className="h-5 w-5 mr-2" />
            Compare Two PDF Files
          </CardTitle>
          <CardDescription>
            Select two PDF files to compare their content and properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="pdf1"
                  className="text-sm font-medium text-gray-700"
                >
                  First PDF File
                </label>
                <Input
                  id="pdf1"
                  name="pdf1"
                  type="file"
                  accept="application/pdf"
                  required
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 h-auto"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pdf2"
                  className="text-sm font-medium text-gray-700"
                >
                  Second PDF File
                </label>
                <Input
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
                  Comparing Files...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare PDFs
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
                        ? "Files Match!"
                        : "Files Do Not Match"}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        comparisonResult.isMatch
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {comparisonResult.isMatch
                        ? "The two PDF files are identical."
                        : "The PDF files have differences."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="bg-white border rounded-md p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Detailed Comparison
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      File Names Match:
                    </span>
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
                        {comparisonResult.details.nameMatch ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      File Sizes Match:
                    </span>
                    <div className="flex items-center">
                      {comparisonResult.details.sizeMatch ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`ml-2 text-sm ${
                          comparisonResult.details.sizeMatch
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {comparisonResult.details.sizeMatch ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Content Match:
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
                        {comparisonResult.details.hashMatch ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h5 className="font-medium text-blue-900 mb-2">First File</h5>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <strong>Name:</strong>{" "}
                      {comparisonResult.details.file1Info.name}
                    </p>
                    <p>
                      <strong>Size:</strong>{" "}
                      {(
                        comparisonResult.details.file1Info.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                    <p>
                      <strong>Hash:</strong>{" "}
                      {comparisonResult.details.file1Info.hash.substring(0, 16)}
                      ...
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h5 className="font-medium text-green-900 mb-2">
                    Second File
                  </h5>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Name:</strong>{" "}
                      {comparisonResult.details.file2Info.name}
                    </p>
                    <p>
                      <strong>Size:</strong>{" "}
                      {(
                        comparisonResult.details.file2Info.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                    <p>
                      <strong>Hash:</strong>{" "}
                      {comparisonResult.details.file2Info.hash.substring(0, 16)}
                      ...
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
                    Comparison Failed
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
          How PDF Comparison Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              1. Upload Files
            </h4>
            <p className="text-gray-600">
              Select two PDF files you want to compare from your device.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <GitCompare className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              2. Analysis
            </h4>
            <p className="text-gray-600">
              We analyze file names, sizes, and generate content hashes for
              comparison.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              3. Results
            </h4>
            <p className="text-gray-600">
              Get detailed comparison results showing matches and differences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
