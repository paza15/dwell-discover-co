import { useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageZoomProps {
  src: string;
  alt: string;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

const ImageZoom = ({ src, alt, onPrevious, onNext, showNavigation = false }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white z-10 shadow-lg"
        onClick={() => setIsZoomed(true)}
        aria-label="Zoom image"
      >
        <ZoomIn className="h-6 w-6" />
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

          {showNavigation && onPrevious && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {showNavigation && onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

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
