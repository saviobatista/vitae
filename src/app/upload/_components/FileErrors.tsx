"use client";

import { FileUploadProps } from "@/types";
// import { useTranslations } from "next-intl"; // Temporarily disabled

export default function FileErrors({ errors, maxMB = 5 }: FileUploadProps) {
  // Temporarily use static text instead of translations
  const t = {
    NOT_PDF: "The file must be a PDF (.pdf).",
    EMPTY_FILE: "The file is empty.",
    TOO_LARGE: (maxMB: number) => `The file exceeds ${maxMB} MB.`
  };
  if (!errors?.length) return null;

  const generateMessage = (code: string): string => {
    if (code === "TOO_LARGE") return t.TOO_LARGE(maxMB);
    if (code === "NOT_PDF") return t.NOT_PDF;
    if (code === "EMPTY_FILE") return t.EMPTY_FILE;
    return code;
  };

  return (
    <div role="status" aria-live="polite" className="mt-4 space-y-2">
      {errors.map((code, i) => {
        const message = generateMessage(code);
        return (
          <div
            key={`${code}-${i}`}
            className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
          >
            {message}
          </div>
        );
      })}
    </div>
  );
}
