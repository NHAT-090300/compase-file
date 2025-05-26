import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

async function generateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file1 = formData.get("pdf1") as File;
    const file2 = formData.get("pdf2") as File;

    if (!file1 || !file2) {
      return NextResponse.json(
        { error: "Both PDF files are required" },
        { status: 400 }
      );
    }

    // Validate file types
    if (file1.type !== "application/pdf" || file2.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file sizes (10MB limit each)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file1.size > maxSize || file2.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate hashes for content comparison
    const [hash1, hash2] = await Promise.all([
      generateFileHash(file1),
      generateFileHash(file2),
    ]);

    // Compare files
    const nameMatch = file1.name === file2.name;
    const sizeMatch = file1.size === file2.size;
    const hashMatch = hash1 === hash2;
    const isMatch = nameMatch && sizeMatch && hashMatch;

    const comparisonResult = {
      isMatch,
      details: {
        nameMatch,
        sizeMatch,
        hashMatch,
        file1Info: {
          name: file1.name,
          size: file1.size,
          hash: hash1,
        },
        file2Info: {
          name: file2.name,
          size: file2.size,
          hash: hash2,
        },
      },
    };

    return NextResponse.json(comparisonResult);
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
