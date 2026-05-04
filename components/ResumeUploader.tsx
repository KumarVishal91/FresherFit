"use client";
import { useCallback, useState } from "react";

interface Props {
  onTextExtracted: (text: string) => void;
  isLoading: boolean;
}

export default function ResumeUploader({ onTextExtracted, isLoading }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File) => {
    setError(null);
    setFileName(file.name);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
      }

      if (fullText.trim().length < 50) {
        setError("Could not extract text. Try a text-based PDF.");
        return;
      }

      onTextExtracted(fullText);
    } catch {
      setError("Failed to read PDF. Make sure it's a valid file.");
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    extractTextFromPDF(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
        ${isDragging ? "border-violet-500 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"}
        ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="text-5xl mb-3">📄</div>
      {fileName ? (
        <p className="text-violet-700 font-semibold">{fileName} ✓</p>
      ) : (
        <>
          <p className="text-gray-600 font-medium">Drop your resume PDF here</p>
          <p className="text-gray-400 text-sm mt-1">or click to browse</p>
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}
