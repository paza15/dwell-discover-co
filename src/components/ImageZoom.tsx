import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  src: string;
  alt: string;
}

const ImageZoom = ({ src, alt }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 bg-background/70 hover:bg-background z-10"
        onClick={() => setIsZoomed(true)}
        aria-label="Zoom image"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoom"
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImageZoom;
