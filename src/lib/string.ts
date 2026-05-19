import { v4 as uuidv4 } from "uuid";

export function sanitize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function generateDocId(): string {
  const id = uuidv4();
  return id;
}

export function ensureAbsoluteUrl(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
