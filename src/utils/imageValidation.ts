/**
 * Client-side image validation helpers.
 *
 * Pure functions only (no DOM access) so they can be unit-tested in Node.
 * This module intentionally has no imports.
 */

export type SupportedFormat = {
  /** Canonical MIME type. */
  mime: string;
  /** Human-readable label shown in the UI. */
  label: string;
  /** Accepted file extensions, lowercase, without the dot. */
  extensions: string[];
};

export const SUPPORTED_FORMATS: SupportedFormat[] = [
  { mime: "image/jpeg", label: "JPG", extensions: ["jpg", "jpeg", "jfif"] },
  { mime: "image/png", label: "PNG", extensions: ["png"] },
  { mime: "image/webp", label: "WebP", extensions: ["webp"] },
  { mime: "image/gif", label: "GIF", extensions: ["gif"] },
];

/** 25 MB per image. Large enough for camera photos, small enough to keep the tab responsive. */
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

/** Maximum number of images held in memory at once. */
export const MAX_FILES = 10;

/** Value for the file input's `accept` attribute. */
export const ACCEPT_ATTRIBUTE = [
  ...SUPPORTED_FORMATS.map((f) => f.mime),
  ...SUPPORTED_FORMATS.flatMap((f) => f.extensions.map((ext) => `.${ext}`)),
].join(",");

export const SUPPORTED_FORMAT_LABELS = SUPPORTED_FORMATS.map((f) => f.label);

export type FileMeta = {
  name: string;
  size: number;
  type: string;
};

export type ValidationResult =
  | { ok: true; format: SupportedFormat }
  | { ok: false; error: string };

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unit]}`;
}

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot <= 0 || dot === fileName.length - 1) return "";
  return fileName.slice(dot + 1).toLowerCase();
}

function formatByMime(mime: string): SupportedFormat | undefined {
  const normalized = mime.toLowerCase() === "image/jpg" ? "image/jpeg" : mime.toLowerCase();
  return SUPPORTED_FORMATS.find((f) => f.mime === normalized);
}

function formatByExtension(ext: string): SupportedFormat | undefined {
  return SUPPORTED_FORMATS.find((f) => f.extensions.includes(ext));
}

function listFormats(): string {
  const labels = SUPPORTED_FORMAT_LABELS;
  return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
}

/**
 * Validate the metadata the browser reports for a file (name, size, MIME type).
 * The file's actual bytes are checked separately with `detectFormatFromBytes`.
 */
export function validateFileMeta(file: FileMeta): ValidationResult {
  const name = file.name || "This file";

  if (file.size === 0) {
    return { ok: false, error: `"${name}" is empty. Please choose a different file.` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `"${name}" is ${formatBytes(file.size)}. The maximum size is ${formatBytes(MAX_FILE_SIZE_BYTES)} per image.`,
    };
  }

  const ext = getExtension(file.name);
  const byMime = file.type ? formatByMime(file.type) : undefined;
  const byExt = ext ? formatByExtension(ext) : undefined;

  // Some browsers/OSes report an empty or generic MIME type; fall back to the extension.
  const genericType = !file.type || file.type === "application/octet-stream";
  const format = byMime ?? (genericType ? byExt : undefined);

  if (!format) {
    const shown = ext ? `.${ext}` : file.type || "unknown type";
    return {
      ok: false,
      error: `"${name}" (${shown}) isn't a supported format. Please use ${listFormats()}.`,
    };
  }

  return { ok: true, format };
}

/**
 * Identify an image format from its leading bytes ("magic numbers").
 * Needs at least the first 12 bytes of the file.
 */
export function detectFormatFromBytes(bytes: Uint8Array): SupportedFormat | undefined {
  const at = (i: number) => bytes[i];
  const ascii = (start: number, text: string) =>
    text.split("").every((ch, i) => at(start + i) === ch.charCodeAt(0));

  if (bytes.length >= 3 && at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff) {
    return formatByMime("image/jpeg");
  }
  if (
    bytes.length >= 8 &&
    at(0) === 0x89 &&
    ascii(1, "PNG") &&
    at(4) === 0x0d &&
    at(5) === 0x0a &&
    at(6) === 0x1a &&
    at(7) === 0x0a
  ) {
    return formatByMime("image/png");
  }
  if (bytes.length >= 6 && (ascii(0, "GIF87a") || ascii(0, "GIF89a"))) {
    return formatByMime("image/gif");
  }
  if (bytes.length >= 12 && ascii(0, "RIFF") && ascii(8, "WEBP")) {
    return formatByMime("image/webp");
  }
  return undefined;
}

/** Stable key for detecting the same file being added twice. */
export function fileIdentity(file: FileMeta & { lastModified?: number }): string {
  return `${file.name}::${file.size}::${file.lastModified ?? 0}`;
}

/** Largest width or height accepted, in pixels (matches common browser canvas limits). */
export const MAX_DIMENSION = 16384;

/** Largest total pixel count accepted (about 100 megapixels). */
export const MAX_PIXELS = 100_000_000;

export function validateDimensions(name: string, width: number, height: number): string | null {
  if (!(width > 0) || !(height > 0)) {
    return `"${name}" couldn't be read as an image. It may be damaged.`;
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return `"${name}" is ${width} × ${height} px. Images can be at most ${MAX_DIMENSION} px on each side.`;
  }
  if (width * height > MAX_PIXELS) {
    return `"${name}" is ${Math.round((width * height) / 1_000_000)} megapixels. The maximum is ${MAX_PIXELS / 1_000_000} megapixels.`;
  }
  return null;
}
