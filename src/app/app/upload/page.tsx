"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import Dropzone from "./_components/Dropzone";
import FileErrors from "./_components/FileErrors";
import SelectedFileCard from "./_components/SelectedFileCard";
import { MAX_FILE_BYTES, validateResumeFile } from "lib/validation/resumeFile";
import { useUpload } from "../lib/state/uploadContext";

export default function UploadPage() {
  const router = useRouter();
  const { file, setFile, clear } = useUpload();
  const [errors, setErrors] = useState<string[]>([]);

  const handleFile = useCallback(
    (f?: File) => {
      if (!f) return;
      const res = validateResumeFile(f);
      setErrors(res.errors);
      setFile(res.ok ? f : null);
    },
    [setFile]
  );

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!file || errors.length) return;
      router.push("/app/builder");
    },
    [file, errors, router]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Send your resume (PDF)
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            We only accept PDF files, up to{" "}
            {(MAX_FILE_BYTES / (1024 * 1024)).toFixed(0)}MB.
          </p>
        </header>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-xl bg-white p-6 shadow dark:bg-slate-900"
        >
          <Dropzone accept="application/pdf" onFile={handleFile} />

          <FileErrors errors={errors} />

          {file && errors.length === 0 && (
            <SelectedFileCard file={file} onClear={clear} />
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Return
            </button>
            <button
              type="submit"
              disabled={!file || errors.length > 0}
              className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
