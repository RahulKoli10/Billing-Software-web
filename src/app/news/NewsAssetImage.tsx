"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";
import { buildApiUrl, buildFallbackApiUrl } from "@/lib/api";

type NewsAssetImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

function resolveAssetUrl(path: string, useFallback: boolean) {
  if (!path) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return useFallback ? buildFallbackApiUrl(path) : buildApiUrl(path);
  }

  return path;
}

export default function NewsAssetImage({
  src,
  alt,
  onError,
  ...props
}: NewsAssetImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const resolvedSrc = useMemo(
    () => resolveAssetUrl(src, useFallback),
    [src, useFallback]
  );
  const isBackendUpload =
    src.startsWith("/uploads/") ||
    src.includes("/uploads/") ||
    src.includes("/backend/uploads/");

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      unoptimized={isBackendUpload}
      onError={(event) => {
        if (src.startsWith("/uploads/") && !useFallback) {
          setUseFallback(true);
        }

        onError?.(event);
      }}
    />
  );
}
