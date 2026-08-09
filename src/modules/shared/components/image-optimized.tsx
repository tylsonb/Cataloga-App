import Image from "next/image";

export function ImageOptimized({ src, alt, width = 400, height = 400, className }: { src: string; alt: string; width?: number; height?: number; className?: string }) {
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
