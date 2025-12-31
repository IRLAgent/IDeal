/**
 * Utility functions for image URL transformations
 */

/**
 * Generate a thumbnail URL from a Cloudinary image URL
 * @param url Original Cloudinary image URL
 * @param width Thumbnail width (default: 200px)
 * @param height Thumbnail height (default: 200px)
 * @returns Thumbnail URL with Cloudinary transformations
 */
export function getThumbnailUrl(url: string, width: number = 200, height: number = 200): string {
  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Cloudinary URL pattern: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}
  // We want to insert transformations after '/upload/'
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  // Insert thumbnail transformation parameters
  // c_fill: crop mode that fills the given dimensions
  // g_auto: automatically detect the most interesting part of the image
  // q_auto: automatically adjust quality
  // f_auto: automatically choose the best format (WebP when supported)
  const transformation = `c_fill,w_${width},h_${height},g_auto,q_auto:good,f_auto`;
  
  const beforeUpload = url.substring(0, uploadIndex + 8); // Include '/upload/'
  const afterUpload = url.substring(uploadIndex + 8);
  
  return `${beforeUpload}${transformation}/${afterUpload}`;
}

/**
 * Generate an optimized full-size URL from a Cloudinary image URL
 * @param url Original Cloudinary image URL
 * @param maxWidth Maximum width (default: 1920px)
 * @returns Optimized URL with Cloudinary transformations
 */
export function getOptimizedUrl(url: string, maxWidth: number = 1920): string {
  // Check if it's a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  // Optimize large images: limit width, auto quality, auto format
  const transformation = `w_${maxWidth},c_limit,q_auto:good,f_auto`;
  
  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);
  
  return `${beforeUpload}${transformation}/${afterUpload}`;
}
