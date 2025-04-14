
/**
 * Utility functions for Cloudinary image optimization
 */

type CloudinaryTransformations = {
  width?: string | number;
  height?: string | number;
  quality?: string | number;
  format?: 'auto' | string;
  crop?: string;
  gravity?: string;
  effect?: string;
  dpr?: string;
};

/**
 * Optimizes a Cloudinary URL with appropriate transformations
 * 
 * @param url Original Cloudinary URL
 * @param transformations Transformation parameters
 * @returns Optimized URL
 */
export const optimizeCloudinaryUrl = (
  url: string,
  transformations: CloudinaryTransformations = {}
): string => {
  // If URL doesn't contain Cloudinary, return as is
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Default transformations
  const defaults: CloudinaryTransformations = {
    format: 'auto',
    quality: 'auto',
    ...transformations
  };

  // Build transformation string
  const transformationParts: string[] = [];
  
  if (defaults.format) transformationParts.push(`f_${defaults.format}`);
  if (defaults.quality) transformationParts.push(`q_${defaults.quality}`);
  if (defaults.width === 'auto') transformationParts.push('w_auto');
  else if (defaults.width) transformationParts.push(`w_${defaults.width}`);
  if (defaults.height) transformationParts.push(`h_${defaults.height}`);
  if (defaults.crop) transformationParts.push(`c_${defaults.crop}`);
  if (defaults.gravity) transformationParts.push(`g_${defaults.gravity}`);
  if (defaults.effect) transformationParts.push(`e_${defaults.effect}`);
  if (defaults.dpr) transformationParts.push(`dpr_${defaults.dpr}`);

  // Join transformations
  const transformationString = transformationParts.join(',');

  // Check if URL already has transformations
  if (url.includes('/upload/')) {
    // Replace existing transformations or insert new ones
    const uploadIndex = url.indexOf('/upload/');
    const hasTransformations = url.includes('/upload/f_') || 
                              url.includes('/upload/q_') ||
                              url.includes('/upload/w_');
    
    if (hasTransformations) {
      // Extract the base and version part
      const basePart = url.substring(0, uploadIndex + 8); // +8 to include '/upload/'
      const afterUpload = url.substring(uploadIndex + 8);
      const versionMatch = afterUpload.match(/v\d+\//);
      
      if (versionMatch) {
        const versionIndex = afterUpload.indexOf(versionMatch[0]) + versionMatch[0].length;
        const versionPart = afterUpload.substring(0, versionIndex);
        const resourcePart = afterUpload.substring(versionIndex);
        
        return `${basePart}${transformationString}/${versionPart}${resourcePart}`;
      } else {
        // If version not found, try to replace existing transformations
        const existingTransformEndIndex = afterUpload.indexOf('/');
        if (existingTransformEndIndex > -1) {
          const resourcePart = afterUpload.substring(existingTransformEndIndex);
          return `${basePart}${transformationString}${resourcePart}`;
        }
      }
    } else {
      // No existing transformations
      return url.replace('/upload/', `/upload/${transformationString}/`);
    }
  }
  
  // If we reach here, just return the original URL
  return url;
};

/**
 * Creates a responsive image srcset for Cloudinary images
 * 
 * @param url Base Cloudinary URL
 * @param widths Array of widths for the srcset
 * @param transformations Additional transformations
 * @returns Generated srcset string
 */
export const generateCloudinarySrcSet = (
  url: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536, 1920],
  transformations: Omit<CloudinaryTransformations, 'width'> = {}
): string => {
  if (!url.includes('cloudinary.com')) {
    return '';
  }
  
  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryUrl(url, {
        ...transformations,
        width
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Extracts core image URL and version from a Cloudinary URL
 * 
 * @param url Complete Cloudinary URL with transformations
 * @returns Base URL without transformations
 */
export const getCloudinaryBaseUrl = (url: string): string => {
  if (!url.includes('cloudinary.com')) {
    return url;
  }
  
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  const basePart = url.substring(0, uploadIndex + 8); // +8 to include '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);
  
  // Check if there are transformations
  const firstSlashAfterUpload = afterUpload.indexOf('/');
  if (firstSlashAfterUpload === -1) return url; // No transformations
  
  // Check if there's a version marker
  const versionMatch = afterUpload.match(/v\d+\//);
  if (versionMatch) {
    const versionIndex = afterUpload.indexOf(versionMatch[0]);
    // If version is after transformations
    if (versionIndex > firstSlashAfterUpload) {
      const resourcePart = afterUpload.substring(firstSlashAfterUpload + 1);
      return `${basePart}${resourcePart}`;
    } else {
      // Version is before transformations
      const versionPart = afterUpload.substring(0, versionMatch[0].length);
      const resourcePart = afterUpload.substring(afterUpload.indexOf('/', versionMatch[0].length) + 1);
      return `${basePart}${versionPart}${resourcePart}`;
    }
  } else {
    // No version, just skip transformations
    const resourcePart = afterUpload.substring(firstSlashAfterUpload + 1);
    return `${basePart}${resourcePart}`;
  }
};
