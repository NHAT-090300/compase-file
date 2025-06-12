import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitText(text: string, visibleCount: number): string {
  if (text.length <= visibleCount * 2) return text;
  const start = text.slice(0, visibleCount);
  const end = text.slice(-visibleCount);
  return `${start}...${end}`;
}

export async function generateHashFromFile(file: File): Promise<`0x${string}`> {
  const arrayBuffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hashHex}`;
}

export async function generateHashFromMultipleFile(
  files: File[]
): Promise<`0x${string}`[]> {
  return Promise.all(files.map((file) => generateHashFromFile(file)));
}
