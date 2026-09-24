"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
// import { useTranslations } from "next-intl"; // Temporarily disabled
import { useUpload } from "@/app/lib/state/uploadContext";
import { extractText } from "@/parser/extractText";
import { segmentBlocks } from "@/parser/segmentBlocks";
import { AITailoringService } from "@/app/builder/_components/AITailoringService";
import JobDescriptionInput from "@/app/builder/_components/JobDescriptionInput";
import ResumePreview from "@/app/builder/_components/ResumePreview";
import { TailoringRequest } from "@/types";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function BuilderPage() {
  const router = useRouter();
  // Temporarily use static text instead of translations
  const t = useMemo(() => ({
    title: "Tailor Your Résumé",
    subtitle: "Paste the job description to customize your résumé",
    fileReceived: ({ name, sizeMB }: { name: string; sizeMB: string }) => `File received: ${name} • ${sizeMB} MB`,
    actions: {
      return: "Back to Upload",
      tailor: "Tailor My Résumé",
      processing: "Tailoring..."
    }
  }), []);
  
  const te = useMemo(() => ({
    AI_TAILORING_FAILED: "Failed to tailor résumé. Please try again.",
    JOB_DESCRIPTION_TOO_SHORT: "Job description is too short. Please provide more details.",
    JOB_DESCRIPTION_TOO_LONG: "Job description is too long. Please keep it under 5000 characters."
  }), []);
  
  const { 
    file, 
    parsedResume, 
    setParsedResume, 
    jobDescription, 
    setJobDescription 
  } = useUpload();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const parsePdfFile = useCallback(async () => {
    if (!file) return;
    
    setIsParsing(true);
    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Extract text from PDF
      const extractedText = await extractText(arrayBuffer);
      
      // Segment the extracted text into blocks
      const segmentationResult = await segmentBlocks(extractedText);
      
      setParsedResume(segmentationResult);
    } catch (error) {
      console.error("Failed to parse PDF:", error);
      setErrors([te.AI_TAILORING_FAILED]);
    } finally {
      setIsParsing(false);
    }
  }, [file, setParsedResume, te.AI_TAILORING_FAILED]);

  // Parse PDF when component mounts if not already parsed
  useEffect(() => {
    if (!file) {
      router.replace("/upload");
      return;
    }

    if (!parsedResume && !isParsing) {
      parsePdfFile();
    }
  }, [file, parsedResume, isParsing, router, parsePdfFile]);

  const validateJobDescription = useCallback((text: string): string[] => {
    const newErrors: string[] = [];
    
    if (text.length < 50) {
      newErrors.push(te.JOB_DESCRIPTION_TOO_SHORT);
    }
    
    if (text.length > 5000) {
      newErrors.push(te.JOB_DESCRIPTION_TOO_LONG);
    }
    
    return newErrors;
  }, [te]);

  const handleJobDescriptionChange = useCallback((text: string) => {
    setJobDescription(text);
    const newErrors = validateJobDescription(text);
    setErrors(newErrors);
  }, [setJobDescription, validateJobDescription]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parsedResume || !jobDescription.trim()) return;
    
    const validationErrors = validateJobDescription(jobDescription);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsProcessing(true);
    setErrors([]);

    try {
      // Create the tailoring request
      const request: TailoringRequest = {
        resumeContent: JSON.stringify(parsedResume.blocks),
        jobDescription: jobDescription.trim()
      };

      // Call AI tailoring service
      const response = await AITailoringService.tailorResume(request);
      
      // For now, just log the response and navigate to a results page
      // In the future, this would navigate to a results page with the tailored content
      console.log("Tailored résumé:", response);
      
      // Navigate to results page (to be implemented)
      // router.push("/results");
      
      // For now, show success message
      alert("Résumé tailored successfully! (This is a placeholder - results page coming soon)");
      
    } catch (error) {
      console.error("Failed to tailor résumé:", error);
      setErrors([te.AI_TAILORING_FAILED]);
    } finally {
      setIsProcessing(false);
    }
  }, [parsedResume, jobDescription, validateJobDescription, te]);

  if (!file) {
    return null;
  }

  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {t.title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
          
          <div className="mt-4 rounded-lg bg-white p-4 shadow dark:bg-slate-800">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {t.fileReceived({ name: file.name, sizeMB })}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Description Input */}
          <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
            <JobDescriptionInput
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              errors={errors}
              isProcessing={isProcessing}
            />
          </div>

          {/* Résumé Preview */}
          {parsedResume && (
            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
              <ResumePreview parsedResume={parsedResume} />
            </div>
          )}

          {/* Loading State for PDF Parsing */}
          {isParsing && (
            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
              <div className="flex items-center justify-center space-x-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  Parsing your résumé...
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/upload")}
              disabled={isProcessing}
              className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.actions.return}
            </button>
            <button
              type="submit"
              disabled={!parsedResume || !jobDescription.trim() || isProcessing || errors.length > 0}
              className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? t.actions.processing : t.actions.tailor}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
