"use client";

import { UploadProvider } from "../../../lib/state/uploadContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <UploadProvider>{children}</UploadProvider>;
}
