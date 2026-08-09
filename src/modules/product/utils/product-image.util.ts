type RowWithImages = { product_images?: { url: string }[] | null };

export function getPrimaryImageUrl(row: unknown): string | undefined {
  const images = (row as RowWithImages)?.product_images;
  return images?.[0]?.url;
}

export function withPrimaryImage<T>(row: T): T & { image_url: string | undefined } {
  return { ...row, image_url: getPrimaryImageUrl(row) };
}

export function withPrimaryImages<T>(rows: T[] | null | undefined): Array<T & { image_url: string | undefined }> {
  return (rows ?? []).map(withPrimaryImage);
}
