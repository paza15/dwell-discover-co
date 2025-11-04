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

export const resolvePropertyImages = (
  imageUrls?: string[] | null,
  primaryImageUrl?: string | null,
) => {
  // If we have image URLs from storage, use them directly
  if (imageUrls && imageUrls.length > 0) {
    return imageUrls;
  }

  // Otherwise fall back to mapped images or primary image
  const resolved = (imageUrls || [])
    .map((url) => resolveImagePath(url))
    .filter(Boolean);

  if (resolved.length > 0) {
    return resolved;
  }

  return [resolveImagePath(primaryImageUrl)];
};

export const resolvePropertyImage = (imageUrl?: string | null, fallbackUrls?: string[] | null) => {
  const images = resolvePropertyImages(fallbackUrls, imageUrl);
  return images[0];
};
