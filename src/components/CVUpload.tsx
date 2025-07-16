"use client";

import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/airtable-insert/uploadthing/core";

export default function CVUpload() {
  const [message, setMessage] = useState("");

  const handleUploadComplete = async (res: { url: string; name: string }[] | undefined) => {
    const file = res?.[0];
    if (!file) {
      setMessage("❌ Erreur : Aucune information de fichier");
      return;
    }

    // 🧠 Appel de l’analyse AI et insertion dans Airtable
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
      <UploadDropzone<OurFileRouter>
        endpoint="cvUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={() => setMessage("❌ Échec du téléversement")}
        className="my-8 ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-400"
      />
      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
}
