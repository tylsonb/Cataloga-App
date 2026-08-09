"use client";

import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll(onLoadMore: () => void) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loading) {
        setLoading(true);
        onLoadMore();
        setLoading(false);
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, loading]);

  return { sentinelRef, loading };
}
