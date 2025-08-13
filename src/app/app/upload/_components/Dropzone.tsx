"use client";
import { DropzoneProps } from "@/types";
import { useRef, useState } from "react";

export default function Dropzone({
  accept = "application/pdf",
  onFile,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    onFile(e.target.files?.[0]);
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    onFile(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`rounded-lg border-2 border-dashed p-8 text-center transition ${dragging ? "border-blue-500 bg-blue-50/60 dark:bg-blue-500/10" : "border-slate-300 dark:border-slate-700"}`}
      aria-label="Arraste e solte seu PDF aqui"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInput}
        className="hidden"
      />
      <div className="mb-3 text-5xl">📄</div>
      <p className="font-medium text-slate-800 dark:text-slate-200">
        Drag your PDF here
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">ou</p>
      <button
        type="button"
        onClick={pick}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Select file
      </button>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Only .pdf • Max 5MB
      </p>
    </div>
  );
}
