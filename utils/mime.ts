// utils/mime.ts
const mimeMap: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  mp4: "video/mp4",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/m4a",
  aac: "audio/aac",
  "3gp": "audio/3gpp",
};

export function getMimeType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  return (ext && mimeMap[ext]) || "application/octet-stream";
}
