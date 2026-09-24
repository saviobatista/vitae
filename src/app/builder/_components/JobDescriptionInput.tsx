"use client";

// import { useTranslations } from "next-intl"; // Temporarily disabled

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  errors: string[];
  isProcessing: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  errors,
  isProcessing,
}: JobDescriptionInputProps) {
  // Temporarily use static text instead of translations
  const t = {
    label: "Job Description",
    placeholder: "Paste the job description here...",
    help: "Include the full job posting to get the best tailored results",
    minLength: "Job description must be at least 50 characters",
    maxLength: "Job description must be less than 5000 characters"
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const hasErrors = errors.length > 0;
  const isTooShort = value.length > 0 && value.length < 50;
  const isTooLong = value.length > 5000;

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="job-description"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {t.label}
        </label>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t.help}
        </p>
      </div>

      <textarea
        id="job-description"
        value={value}
        onChange={handleChange}
        placeholder={t.placeholder}
        disabled={isProcessing}
        rows={8}
        className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
          hasErrors || isTooShort || isTooLong
            ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
        } ${
          value.length > 0 && !hasErrors && !isTooShort && !isTooLong
            ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
            : ""
        }`}
      />

      {/* Character count and validation */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {isTooShort && (
            <span className="text-amber-600 dark:text-amber-400">
              {t.minLength}
            </span>
          )}
          {isTooLong && (
            <span className="text-red-600 dark:text-red-400">
              {t.maxLength}
            </span>
          )}
        </div>
        <span
          className={`${
            isTooLong
              ? "text-red-600 dark:text-red-400"
              : isTooShort
              ? "text-amber-600 dark:text-amber-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {value.length}/5000
        </span>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
            >
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
