export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: "folder" | "image" | "video" | "audio" | "document" | "other";
  uploadDate: Date;
  url?: string;
  file: File;
}
