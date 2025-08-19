"use client";

import { SelectedFileCardProps } from "@/types";

export default function SelectedFileCard({
  file,
  onClear,
}: SelectedFileCardProps) {
  const mb = (file.size / (1024 * 1024)).toFixed(2);
  return (
    <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="min-w-0">
        <p className="truncate text-slate-800 dark:text-slate-200">
          {file.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{mb} MB</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        Remove
      </button>
    </div>
  );
}
