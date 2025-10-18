import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const imageMap: Record<string, string> = {
  "property-1.jpg": property1,
  "property-2.jpg": property2,
  "property-3.jpg": property3,
};

const fallbackImage = property1;

const resolveImagePath = (path?: string | null) => {
  if (!path) {
    return fallbackImage;
  }

  return imageMap[path] || path;
};

const normalizeImageList = (imageUrls?: string[] | string | null): string[] => {
  if (!imageUrls) {
    return [];
  }

  if (Array.isArray(imageUrls)) {
    return imageUrls.filter((url): url is string => typeof url === 'string' && url.length > 0);
  }

  const trimmed = imageUrls.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === 'string' && value.length > 0);
    }
  } catch (error) {
    console.warn('Unable to parse property image URLs. Falling back to delimiter split.', error);
  }

  return trimmed
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
};

export const resolvePropertyImages = (
  imageUrls?: string[] | string | null,
  primaryImageUrl?: string | null,
) => {
  const resolved = normalizeImageList(imageUrls)
    .map((url) => resolveImagePath(url))
    .filter(Boolean);

  if (resolved.length > 0) {
    return resolved;
  }

  return [resolveImagePath(primaryImageUrl)];
};

export const resolvePropertyImage = (imageUrl?: string | null, fallbackUrls?: string[] | string | null) => {
  const images = resolvePropertyImages(fallbackUrls, imageUrl);
  return images[0];
};
