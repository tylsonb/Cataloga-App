"use client";

import { useAnalytics } from "@/modules/analytics/hooks/use-analytics.hook";

export function ProductViewTracker({ productId }: { productId: string }) {
  useAnalytics(productId);
  return null;
}
