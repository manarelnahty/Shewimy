/**
 * Validates whether an image source is safe to be loaded or parsed.
 * Prevents Next.js runtime TypeError: Failed to construct 'URL': Invalid URL.
 */
export function isValidImageUrl(url: unknown): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Local relative paths (e.g. /uploads/..., /images/...)
  if (trimmed.startsWith("/")) return true;

  // Data URLs or Blob URLs
  if (trimmed.startsWith("data:image/") || trimmed.startsWith("blob:")) return true;

  // Fully-qualified HTTP/HTTPS URLs
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
