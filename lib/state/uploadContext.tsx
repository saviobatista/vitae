"use client";

import { UploadContextValue } from "@/types";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);

  const value = useMemo<UploadContextValue>(
    () => ({
      file,
      setFile,
      clear: () => setFile(null),
    }),
    [file]
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return ctx;
}
