import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILE_SIZE_BYTES,
  detectFormatFromBytes,
  fileIdentity,
  formatBytes,
  getExtension,
  validateDimensions,
  validateFileMeta,
} from "../src/utils/imageValidation.ts";

const bytes = (...values: (number | string)[]) =>
  new Uint8Array(values.flatMap((v) => (typeof v === "string" ? [...v].map((c) => c.charCodeAt(0)) : [v])));

test("formatBytes", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(1536), "1.5 KB");
  assert.equal(formatBytes(25 * 1024 * 1024), "25 MB");
  assert.equal(formatBytes(-1), "0 B");
});

test("getExtension", () => {
  assert.equal(getExtension("photo.JPG"), "jpg");
  assert.equal(getExtension("archive.tar.gz"), "gz");
  assert.equal(getExtension("noext"), "");
  assert.equal(getExtension(".hidden"), "");
  assert.equal(getExtension("trailing."), "");
});

test("validateFileMeta accepts supported formats", () => {
  for (const [name, type] of [
    ["a.jpg", "image/jpeg"],
    ["a.jpeg", "image/jpg"],
    ["a.png", "image/png"],
    ["a.webp", "image/webp"],
    ["a.gif", "image/gif"],
  ]) {
    const r = validateFileMeta({ name, type, size: 1000 });
    assert.equal(r.ok, true, `${name} should be accepted`);
  }
});

test("validateFileMeta falls back to extension when MIME is missing or generic", () => {
  assert.equal(validateFileMeta({ name: "a.png", type: "", size: 10 }).ok, true);
  assert.equal(validateFileMeta({ name: "a.webp", type: "application/octet-stream", size: 10 }).ok, true);
  assert.equal(validateFileMeta({ name: "a.txt", type: "", size: 10 }).ok, false);
});

test("validateFileMeta rejects unsupported types with a helpful message", () => {
  const r = validateFileMeta({ name: "doc.pdf", type: "application/pdf", size: 1000 });
  assert.equal(r.ok, false);
  if (!r.ok) {
    assert.match(r.error, /doc\.pdf/);
    assert.match(r.error, /JPG, PNG, WebP or GIF/);
  }
  assert.equal(validateFileMeta({ name: "x.heic", type: "image/heic", size: 1000 }).ok, false);
  assert.equal(validateFileMeta({ name: "x.svg", type: "image/svg+xml", size: 1000 }).ok, false);
});

test("validateFileMeta rejects empty and oversized files", () => {
  const empty = validateFileMeta({ name: "a.png", type: "image/png", size: 0 });
  assert.equal(empty.ok, false);
  if (!empty.ok) assert.match(empty.error, /empty/);

  assert.equal(validateFileMeta({ name: "a.png", type: "image/png", size: MAX_FILE_SIZE_BYTES }).ok, true);
  const big = validateFileMeta({ name: "a.png", type: "image/png", size: MAX_FILE_SIZE_BYTES + 1 });
  assert.equal(big.ok, false);
  if (!big.ok) assert.match(big.error, /maximum size is 25 MB/);
});

test("detectFormatFromBytes recognises magic numbers", () => {
  assert.equal(detectFormatFromBytes(bytes(0xff, 0xd8, 0xff, 0xe0))?.label, "JPG");
  assert.equal(detectFormatFromBytes(bytes(0x89, "PNG", 0x0d, 0x0a, 0x1a, 0x0a))?.label, "PNG");
  assert.equal(detectFormatFromBytes(bytes("GIF89a"))?.label, "GIF");
  assert.equal(detectFormatFromBytes(bytes("GIF87a"))?.label, "GIF");
  assert.equal(detectFormatFromBytes(bytes("RIFF", 0, 0, 0, 0, "WEBP"))?.label, "WebP");
});

test("detectFormatFromBytes rejects non-images and truncated headers", () => {
  assert.equal(detectFormatFromBytes(bytes("%PDF-1.7")), undefined);
  assert.equal(detectFormatFromBytes(bytes("RIFF", 0, 0, 0, 0, "WAVE")), undefined);
  assert.equal(detectFormatFromBytes(bytes(0xff, 0xd8)), undefined);
  assert.equal(detectFormatFromBytes(new Uint8Array()), undefined);
});

test("validateDimensions", () => {
  assert.equal(validateDimensions("a.png", 1920, 1080), null);
  assert.match(validateDimensions("a.png", 0, 0) ?? "", /couldn't be read/);
  assert.match(validateDimensions("a.png", 20000, 100) ?? "", /16384 px/);
  assert.match(validateDimensions("a.png", 12000, 12000) ?? "", /megapixels/);
});

test("fileIdentity and accept attribute", () => {
  assert.equal(fileIdentity({ name: "a.png", size: 5, type: "image/png", lastModified: 7 }), "a.png::5::7");
  assert.match(ACCEPT_ATTRIBUTE, /image\/png/);
  assert.match(ACCEPT_ATTRIBUTE, /\.webp/);
});
