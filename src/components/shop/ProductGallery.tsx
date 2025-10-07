import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGalleryProps {
  images: any;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const imageArray = images && typeof images === "object" 
    ? Object.entries(images).map(([key, url]) => ({ key, url: url as string }))
    : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isZoomed) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, selectedIndex]);

  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % imageArray.length);
  };

  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  if (imageArray.length === 0) {
    return (
      <div className="aspect-square bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-square bg-gray-900 rounded-xl overflow-hidden group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 bg-gray-800" />
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={imageArray[selectedIndex].url}
            alt={`${productName} - ${imageArray[selectedIndex].key}`}
            className="w-full h-full object-contain p-8 product-glow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setImageLoaded(true)}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
            <ZoomIn className="h-10 w-10 text-white drop-shadow-lg" />
            <span className="text-white text-sm font-medium drop-shadow-lg">Click to zoom</span>
          </div>
        </div>

        {imageArray.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {selectedIndex + 1} / {imageArray.length}
          </div>
        )}
      </motion.div>

      {/* Thumbnails */}
      {imageArray.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imageArray.map((img, idx) => (
            <motion.button
              key={img.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all bg-gray-900 ${
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-gray-800 hover:border-primary/50"
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} - ${img.key}`}
                className="w-full h-full object-contain p-2"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {selectedIndex + 1} / {imageArray.length}
            </div>

            {/* Main Image */}
            <div className="flex items-center justify-center h-full p-4" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={selectedIndex}
                src={imageArray[selectedIndex].url}
                alt={productName}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Navigation Arrows */}
            {imageArray.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            {imageArray.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 p-3 rounded-full backdrop-blur-sm">
                {imageArray.map((img, idx) => (
                  <button
                    key={img.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(idx);
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedIndex === idx
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${productName} - ${img.key}`}
                      className="w-full h-full object-contain bg-gray-900"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
