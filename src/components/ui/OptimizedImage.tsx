
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  srcSet?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
}

/**
 * OptimizedImage component with best practices for performance
 * - Explicit width and height to prevent layout shifts
 * - Lazy loading by default (unless priority is true)
 * - Responsive images with srcSet and sizes
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  sizes = "100vw",
  className,
  srcSet,
  objectFit = "cover",
  priority = false,
}: OptimizedImageProps) => {
  // Generate default srcSet if not provided
  const defaultSrcSet = !srcSet && src.includes('cloudinary.com') 
    ? `${src.replace('/upload/', '/upload/w_640/')} 640w, 
       ${src.replace('/upload/', '/upload/w_750/')} 750w, 
       ${src.replace('/upload/', '/upload/w_1080/')} 1080w, 
       ${src.replace('/upload/', '/upload/w_1440/')} 1440w`
    : srcSet;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      sizes={sizes}
      srcSet={defaultSrcSet}
      className={cn(`object-${objectFit}`, className)}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    />
  );
};

export default OptimizedImage;
