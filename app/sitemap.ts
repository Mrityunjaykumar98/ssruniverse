import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

/** One page, so one entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl.href, changeFrequency: "monthly", priority: 1 }];
}
