"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/airtable-insert/uploadthing/core";

type CVUploadProps = {
  onFilesUploaded?: (files: File[]) => void;
  onAnalyzeProfiles?: () => void;
};

export default function CVUpload({ onFilesUploaded, onAnalyzeProfiles }: CVUploadProps) {
  const [message, setMessage] = useState("");

  const handleUploadComplete = async (res: { url: string; name: string }[] | undefined) => {
    const file = res?.[0];
    if (!file) {
      setMessage("❌ Erreur : Aucune information de fichier");
      return;
    }

    try {
      const response = await fetch("/api/parse-cv/parse-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: file.url,
          filename: file.name,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("✅ CV analysé et envoyé à Airtable !");
        onFilesUploaded?.([file as any]); // Optionnel
      } else {
        setMessage("❌ Analyse échouée.");
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse :", err);
      setMessage("❌ Erreur serveur lors de l'analyse.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <UploadDropzone<OurFileRouter, "cvUploader">
        endpoint="cvUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={() => setMessage("❌ Échec du téléversement")}
        className="my-8 ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-400"
      />


      {message && (
        <div className="mt-4 text-center text-sm text-green-700">{message}</div>
      )}

      {message.startsWith("✅") && onAnalyzeProfiles && (
        <button
          onClick={onAnalyzeProfiles}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          🎯 Analyser les profils
        </button>
        
      )}
    </div>
  );
}
