export type ToolIconName =
  | "compress"
  | "resize"
  | "jpgToPng"
  | "pngToJpg"
  | "webp"
  | "crop"
  | "rotate"
  | "watermark"
  | "base64"
  | "favicon";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: ToolIconName;
};

export const tools: Tool[] = [
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Reduce file size while keeping your images looking sharp.",
    icon: "compress",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Change dimensions by pixels or percentage in a few clicks.",
    icon: "resize",
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG photos to lossless PNG files.",
    icon: "jpgToPng",
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    description: "Turn PNG images into smaller, widely compatible JPGs.",
    icon: "pngToJpg",
  },
  {
    slug: "webp-converter",
    name: "WebP Converter",
    description: "Convert to and from WebP, the modern format for the web.",
    icon: "webp",
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Trim edges or crop to common aspect ratios precisely.",
    icon: "crop",
  },
  {
    slug: "image-rotator",
    name: "Image Rotator",
    description: "Rotate or flip images to get the orientation just right.",
    icon: "rotate",
  },
  {
    slug: "image-watermark",
    name: "Image Watermark",
    description: "Add a text or logo watermark to protect your work.",
    icon: "watermark",
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    description: "Encode images as Base64 strings for HTML, CSS or JSON.",
    icon: "base64",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description: "Create favicons in the sizes browsers and devices expect.",
    icon: "favicon",
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function toolHref(tool: Tool): string {
  return `/tools/${tool.slug}`;
}
