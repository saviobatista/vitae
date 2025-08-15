"use client";

import { useTranslations } from "next-intl";
import { Props } from "@/types";

export default function FileErrors({ errors, maxMB = 5 }: Props) {
  const t = useTranslations("errors");
  if (!errors?.length) return null;

  return (
    <div role="status" aria-live="polite" className="mt-4 space-y-2">
      {errors.map((code, i) => {
        let message: string;
        switch (code) {
          case "NOT_PDF":
            message = t("NOT_PDF");
            break;
          case "EMPTY_FILE":
            message = t("EMPTY_FILE");
            break;
          case "TOO_LARGE":
            message = t("TOO_LARGE", { maxMB });
            break;
          default:
            message = code;
        }

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
