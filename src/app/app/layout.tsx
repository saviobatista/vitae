"use client";

import { UploadProvider } from "@/app/app/lib/state/uploadContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <UploadProvider>{children}</UploadProvider>;
}
