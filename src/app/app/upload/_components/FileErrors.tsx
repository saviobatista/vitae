"use client";

import { FileErrorsProps } from "@/types";

export default function FileErrors({ errors }: FileErrorsProps) {
  return (
    <div role="status" aria-live="polite" className="mt-4 space-y-2">
      {errors.map((err, i) => (
        <div
          key={i}
          className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
        >
          {err}
        </div>
      ))}
    </div>
  );
}
