'use client';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface ClientImageProps extends ImageProps {
  fallbackSrc: string; 
}

/**
 * A Client Component wrapper around next/image to handle image loading errors
 * and fallback to a specified source.
 */
export function ClientImage(props: ClientImageProps) {
  const { src, fallbackSrc, alt, onError, ...rest } = props;

  // State to manage the image source, defaults to the original src
  const [imgSrc, setImgSrc] = useState(src);

  // Effect to reset the imgSrc if the 'src' prop changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // Custom error handler
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Set the source to the fallback image
    setImgSrc(fallbackSrc);
    // Call the original onError prop if it was provided
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...rest} // Spread other props 
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}