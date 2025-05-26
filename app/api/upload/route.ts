import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import { createHash } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const FILE_PATH = path.join(UPLOAD_DIR, "uploaded.pdf");
const METADATA_PATH = path.join(UPLOAD_DIR, "metadata.json");

async function generateHashFromBuffer(buffer: Buffer): Promise<string> {
  return "0x" + createHash("sha256").update(buffer).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Không có tệp nào được tải lên" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Chỉ cho phép các tệp PDF." },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 100 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Kích thước tệp vượt quá giới hạn 100MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await mkdir(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(FILE_PATH, buffer);

    // Tạo hash
    const hash = await generateHashFromBuffer(buffer);

    // Lưu thông tin file
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      hash,
      lastModified: new Date(file.lastModified).toISOString(),
    };

    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));

    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(FILE_PATH) || !fs.existsSync(METADATA_PATH)) {
      return NextResponse.json(
        { error: "Không có tệp nào được tải lên" },
        { status: 404 }
      );
    }

    const metadataRaw = fs.readFileSync(METADATA_PATH, "utf8");
    const metadata = JSON.parse(metadataRaw);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
