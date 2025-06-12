export function generateFileId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getFileType(
  fileName: string
): "folder" | "image" | "video" | "audio" | "document" | "other" {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) return "other";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
  const audioExtensions = ["mp3", "wav", "flac", "aac", "ogg", "wma"];
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "rtf",
  ];

  if (imageExtensions.includes(extension)) return "image";
  if (videoExtensions.includes(extension)) return "video";
  if (audioExtensions.includes(extension)) return "audio";
  if (documentExtensions.includes(extension)) return "document";

  return "other";
}

export function getFileIcon(type: string): string {
  switch (type) {
    case "folder":
      return "📁";
    case "image":
      return "🖼️";
    case "video":
      return "🎥";
    case "audio":
      return "🎵";
    case "document":
      return "📄";
    default:
      return "📄";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
