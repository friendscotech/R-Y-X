"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_FORMAT_LABELS,
  detectFormatFromBytes,
  fileIdentity,
  formatBytes,
  validateDimensions,
  validateFileMeta,
} from "@/utils/imageValidation";
import type { SupportedFormat } from "@/utils/imageValidation";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CloseIcon,
  ImageIcon,
  LockIcon,
  UploadIcon,
} from "@/components/ui/Icons";

type SelectedImage = {
  id: string;
  key: string;
  file: File;
  url: string;
  width: number;
  height: number;
  format: SupportedFormat;
};

type Outcome = { ok: true; image: SelectedImage } | { ok: false; error: string };

/** Load an object URL into an <img> to confirm the browser can decode it and read its size. */
function decodeImage(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("decode failed"));
    img.src = url;
  });
}

async function inspectFile(file: File): Promise<Outcome> {
  const meta = validateFileMeta(file);
  if (!meta.ok) return meta;

  let detected: SupportedFormat | undefined;
  try {
    const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    detected = detectFormatFromBytes(header);
  } catch {
    return { ok: false, error: `"${file.name}" couldn't be read. Please try selecting it again.` };
  }
  if (!detected) {
    return {
      ok: false,
      error: `"${file.name}" doesn't appear to be a valid ${meta.format.label} image. The file may be damaged or renamed.`,
    };
  }

  const url = URL.createObjectURL(file);
  try {
    const { width, height } = await decodeImage(url);
    const dimensionError = validateDimensions(file.name, width, height);
    if (dimensionError) {
      URL.revokeObjectURL(url);
      return { ok: false, error: dimensionError };
    }
    return {
      ok: true,
      image: {
        id: `${fileIdentity(file)}::${Math.random().toString(36).slice(2, 8)}`,
        key: fileIdentity(file),
        file,
        url,
        width,
        height,
        format: detected,
      },
    };
  } catch {
    URL.revokeObjectURL(url);
    return { ok: false, error: `"${file.name}" couldn't be opened as an image. It may be damaged.` };
  }
}

export function ImageUploader() {
  const inputId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const browseRef = useRef<HTMLButtonElement>(null);
  const dragDepth = useRef(0);

  const [images, setImages] = useState<SelectedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState("");

  // Mirror of `images` for async handlers and unmount cleanup.
  const imagesRef = useRef<SelectedImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Revoke every object URL we still hold when the component unmounts.
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
      imagesRef.current = [];
    };
  }, []);

  // Stop the browser from navigating to an image dropped outside the drop zone.
  useEffect(() => {
    const prevent = (e: globalThis.DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const incoming = Array.from(list);
    if (incoming.length === 0) return;

    setIsChecking(true);
    setStatus("Checking your images…");

    const newErrors: string[] = [];
    const existing = new Set(imagesRef.current.map((img) => img.key));
    let slots = MAX_FILES - imagesRef.current.length;
    let skippedForLimit = 0;
    const toInspect: File[] = [];

    for (const file of incoming) {
      const key = fileIdentity(file);
      if (existing.has(key)) {
        newErrors.push(`"${file.name}" has already been added.`);
        continue;
      }
      if (slots <= 0) {
        skippedForLimit += 1;
        continue;
      }
      existing.add(key);
      toInspect.push(file);
      slots -= 1;
    }

    const outcomes = await Promise.all(toInspect.map(inspectFile));
    const accepted: SelectedImage[] = [];
    for (const outcome of outcomes) {
      if (outcome.ok) accepted.push(outcome.image);
      else newErrors.push(outcome.error);
    }
    // Validation errors first, then the limit notice at the end.
    if (skippedForLimit > 0) {
      newErrors.push(
        `You can add up to ${MAX_FILES} images at a time. ${skippedForLimit} ${
          skippedForLimit === 1 ? "file was" : "files were"
        } not added.`,
      );
    }

    const next = [...imagesRef.current, ...accepted];
    imagesRef.current = next;
    setImages(next);
    setErrors(newErrors);
    setIsChecking(false);

    const parts: string[] = [];
    if (accepted.length) parts.push(`${accepted.length} ${accepted.length === 1 ? "image" : "images"} added`);
    if (newErrors.length) parts.push(`${newErrors.length} ${newErrors.length === 1 ? "problem" : "problems"} found`);
    setStatus(parts.join(", ") + ".");
  }, []);

  const removeImage = useCallback((id: string) => {
    const target = imagesRef.current.find((img) => img.id === id);
    if (!target) return;
    URL.revokeObjectURL(target.url);
    const next = imagesRef.current.filter((img) => img.id !== id);
    imagesRef.current = next;
    setImages(next);
    setStatus(`Removed ${target.file.name}.`);
    if (next.length === 0) browseRef.current?.focus();
  }, []);

  const clearAll = useCallback(() => {
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    imagesRef.current = [];
    setImages([]);
    setErrors([]);
    setStatus("All images removed.");
    browseRef.current?.focus();
  }, []);

  const openPicker = () => inputRef.current?.click();

  /* ----- Drag & drop ----- */
  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  };
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!hasFiles(e)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
  };

  // Clicking empty space in the zone opens the picker too (the button remains the keyboard target).
  const onZoneClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, input")) return;
    openPicker();
  };

  const totalSize = images.reduce((sum, img) => sum + img.file.size, 0);
  const isFull = images.length >= MAX_FILES;
  const formatsText = SUPPORTED_FORMAT_LABELS.join(", ");

  return (
    <div className="w-full">
      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onZoneClick}
        data-dragging={isDragging || undefined}
        className={`group relative cursor-pointer rounded-3xl border-2 border-dashed bg-white px-5 text-center shadow-card transition-colors sm:px-10 ${
          images.length ? "py-8" : "py-10 sm:py-14"
        } ${
          isDragging
            ? "border-accent bg-accent-soft"
            : "border-line-strong hover:border-accent/60 hover:bg-surface/60"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          multiple
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = ""; // allow selecting the same file again later
          }}
        />

        <div
          className={`mx-auto grid size-14 place-items-center rounded-2xl transition-colors ${
            isDragging ? "bg-accent text-white" : "bg-accent-soft text-accent-strong"
          }`}
          aria-hidden="true"
        >
          <UploadIcon className="size-7" />
        </div>

        <p className="mt-5 text-lg font-semibold text-ink sm:text-xl">
          {isDragging ? "Drop your images here" : images.length ? "Add more images" : "Drag & drop your images here"}
        </p>
        <p className="mt-1.5 text-[15px] text-muted">or</p>

        <button
          ref={browseRef}
          type="button"
          onClick={openPicker}
          disabled={isChecking || isFull}
          aria-describedby={hintId}
          className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImageIcon className="size-5" />
          {isChecking ? "Checking…" : "Browse Images"}
        </button>

        <p id={hintId} className="mt-5 text-sm text-muted">
          {formatsText} · Up to {formatBytes(MAX_FILE_SIZE_BYTES)} each · Max {MAX_FILES} images
          {isFull && <span className="block font-medium text-ink-soft">You&apos;ve reached the {MAX_FILES}-image limit.</span>}
        </p>
      </div>

      <p className="mt-4 flex items-start justify-center gap-2 text-sm text-muted">
        <LockIcon className="mt-0.5 size-4 shrink-0 text-accent-strong" />
        <span>Files are opened locally in your browser and aren&apos;t uploaded to a server.</span>
      </p>

      {/* Screen-reader status updates */}
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      {errors.length > 0 && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-danger-line bg-danger-soft p-4 text-left"
        >
          <div className="flex items-start gap-3">
            <AlertIcon className="mt-0.5 size-5 shrink-0 text-danger" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-danger">
                {errors.length === 1 ? "One file couldn't be added" : `${errors.length} files couldn't be added`}
              </p>
              <ul className="mt-1.5 space-y-1 text-sm break-words text-ink-soft">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setErrors([])}
              className="-m-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-ink"
            >
              <span className="sr-only">Dismiss errors</span>
              <CloseIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <section aria-labelledby="selected-heading" className="mt-6 rounded-3xl border border-line bg-white p-4 text-left shadow-card sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="selected-heading" className="text-base font-semibold text-ink">
                {images.length} {images.length === 1 ? "image" : "images"} selected
              </h2>
              <p className="text-sm text-muted">{formatBytes(totalSize)} total · held in browser memory only</p>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-10 items-center rounded-xl border border-line px-4 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:bg-surface hover:text-ink"
            >
              Clear all
            </button>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <li key={img.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:12px_12px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                  <img src={img.url} alt={`Preview of ${img.file.name}`} className="size-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink" title={img.file.name}>
                    {img.file.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {img.format.label} · {img.width} × {img.height} · {formatBytes(img.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-ink"
                >
                  <span className="sr-only">Remove {img.file.name}</span>
                  <CloseIcon className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-ink-soft">
              <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-accent-strong" />
              <span>
                Your images are ready. Editing and conversion tools are coming soon. Browse what&apos;s planned below.
              </span>
            </p>
            <Link
              href="#tools"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-accent-strong ring-1 ring-accent-line transition-colors hover:bg-white/70"
            >
              View tools
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
