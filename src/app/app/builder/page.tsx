"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpload } from "../../../../lib/state/uploadContext";

export default function BuilderPage() {
  const router = useRouter();
  const { file } = useUpload();

  useEffect(() => {
    if (!file) {
      router.replace("/app/upload");
    }
  }, [file, router]);

  if (!file) {
    return null;
  }

  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Builder
        </h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          File received: <strong>{file.name}</strong> • {sizeMB} MB
        </p>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          PDF remodeling here later
        </p>
      </div>
    </main>
  );
}
