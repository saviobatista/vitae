"use client";

import { UploadContextValue, SegmentationResult } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedResume, setParsedResume] = useState<SegmentationResult | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  const value: UploadContextValue = {
    file,
    setFile,
    parsedResume,
    setParsedResume,
    jobDescription,
    setJobDescription,
    clear: () => {
      setFile(null);
      setParsedResume(null);
      setJobDescription("");
    },
  };

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
