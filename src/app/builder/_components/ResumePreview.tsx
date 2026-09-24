"use client";

// import { useTranslations } from "next-intl"; // Temporarily disabled
import { SegmentationResult } from "@/types";

interface ResumePreviewProps {
  parsedResume: SegmentationResult;
}

export default function ResumePreview({ parsedResume }: ResumePreviewProps) {
  // Temporarily use static text instead of translations
  const t = {
    title: "Parsed Résumé Content",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    confidence: ({ confidence }: { confidence: number }) => `Confidence: ${confidence}%`
  };

  const formatContent = (content: string | undefined): string => {
    if (!content) return "";
    // Truncate long content and add ellipsis
    return content.length > 200 ? `${content.slice(0, 200)}...` : content;
  };

  const confidencePercentage = Math.round(parsedResume.metadata.confidence * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          {t.title}
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {t.confidence({ confidence: confidencePercentage })}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Experience Section */}
        {parsedResume.blocks.experience && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <h4 className="mb-2 font-medium text-slate-800 dark:text-slate-200">
              {t.experience}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatContent(parsedResume.blocks.experience)}
            </p>
          </div>
        )}

        {/* Education Section */}
        {parsedResume.blocks.education && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <h4 className="mb-2 font-medium text-slate-800 dark:text-slate-200">
              {t.education}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatContent(parsedResume.blocks.education)}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {parsedResume.blocks.skills && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60 md:col-span-2">
            <h4 className="mb-2 font-medium text-slate-800 dark:text-slate-200">
              {t.skills}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {formatContent(parsedResume.blocks.skills)}
            </p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {parsedResume.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Note:</strong> {parsedResume.warnings.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
