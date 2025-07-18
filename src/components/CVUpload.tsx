import React, { useCallback, useState } from "react";

interface CVUploadProps {
  onAnalyzeProfiles?: () => void;
}

const CVUpload: React.FC<CVUploadProps> = ({ onAnalyzeProfiles }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      return (
        allowedTypes.includes(file.type) ||
        allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      );
    });

    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    setMessage("⏳ Téléversement en cours...");

    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    try {
      // Étape 1 : upload via route API custom vers UploadThing
      const uploadRes = await fetch("/api/airtable-insert/uploadthing", {
        method: "POST",
        body: formData,
      });

      const uploaded = await uploadRes.json(); // [{ url, name }]
      console.log("✅ UploadThing result:", uploaded);

      // Étape 2 : Analyse de chaque fichier
      for (const file of uploaded) {
        const { url, name } = file;

        // const res = await fetch("/api/parse-cv/parse-analyze",
        const res = await fetch("/api/upload-parse-store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, filename: name }),
        });

        if (!res.ok) {
          console.error(`❌ Erreur analyse CV ${name}`);
        } else {
          console.log(`✅ Analyse réussie pour ${name}`);
        }
      }

      setMessage("✅ Tous les fichiers ont été analysés avec succès");

      if (onAnalyzeProfiles) onAnalyzeProfiles();

    } catch (err) {
      console.error("❌ Erreur d'upload ou d'analyse :", err);
      setMessage("❌ Échec du téléversement ou de l’analyse");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragOver ? "bg-blue-50 border-blue-400" : "bg-white border-gray-300"
      }`}
    >
      <p className="text-lg font-medium text-gray-700 mb-2">
        Glissez et déposez vos CV ici ou cliquez pour sélectionner
      </p>
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
        id="cv-upload"
      />
      <label htmlFor="cv-upload" className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
        Ajouter des fichiers
      </label>

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default CVUpload;
