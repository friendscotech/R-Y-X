import type { MetadataRoute } from "next";

// Search indexing is disabled until launch.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
