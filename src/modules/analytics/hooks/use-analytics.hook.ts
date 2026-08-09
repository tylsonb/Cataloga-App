"use client";

import { useEffect } from "react";
import { trackProductViewAction } from "@/modules/analytics/actions/analytics.actions";
import { getSessionId } from "@/modules/analytics/utils/session.util";

export function useAnalytics(productId?: string) {
  useEffect(() => {
    if (productId) {
      trackProductViewAction(productId, getSessionId());
    }
  }, [productId]);
}
