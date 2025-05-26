import { type NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const FILE_PATH = path.join(UPLOAD_DIR, "uploaded.pdf");
const METADATA_PATH = path.join(UPLOAD_DIR, "metadata.json");

async function generateHashFromBuffer(buffer: Buffer): Promise<string> {
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const originalHash = formData.get("originalHash");
    const fileToCompare = formData.get("pdf") as File;

    if (!fileToCompare) {
      return NextResponse.json(
        { error: "Không có tệp nào được tải lên để kiểm tra." },
        { status: 400 }
      );
    }

    if (fileToCompare.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Chỉ cho phép các tệp PDF." },
        { status: 400 }
      );
    }

    const maxSize = 100 * 1024 * 1024;
    if (fileToCompare.size > maxSize) {
      return NextResponse.json(
        { error: "Kích thước tệp vượt quá giới hạn 100MB." },
        { status: 400 }
      );
    }

    const metadataRaw = fs.readFileSync(METADATA_PATH, "utf8");
    const metadata = JSON.parse(metadataRaw);

    // Đọc file so sánh
    const compareBuffer = Buffer.from(await fileToCompare.arrayBuffer());

    // Tạo hash
    const hash2 = await generateHashFromBuffer(compareBuffer);

    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    // Thông tin file
    const file1Info = {
      ...metadata,
      hash: originalHash,
    };

    const file2Info = {
      name: fileToCompare.name,
      size: fileToCompare.size,
      hash: hash2,
    };

    // So sánh
    const nameMatch = file1Info.name === file2Info.name;
    const sizeMatch = file1Info.size === file2Info.size;

    const hashMatch = originalHash === file2Info.hash;
    const isMatch = nameMatch && sizeMatch && hashMatch;

    const comparisonResult = {
      isMatch,
      details: {
        nameMatch,
        sizeMatch,
        hashMatch,
        file1Info,
        file2Info,
      },
    };

    return NextResponse.json(comparisonResult);
  } catch (error) {
    console.error("Compare error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
