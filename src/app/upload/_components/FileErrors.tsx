"use client";

import { FileUploadProps } from "@/types";
import { useTranslations } from "next-intl";

export default function FileErrors({ errors, maxMB = 5 }: FileUploadProps) {
  const t = useTranslations("errors");
  if (!errors?.length) return null;

  const generateMessage = (code: string): string => {
    return code === "TOO_LARGE" ? t("TOO_LARGE", { maxMB }) : t(code);
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
