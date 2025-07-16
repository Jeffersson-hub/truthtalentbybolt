// src/lib/officceparser.ts

import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function parseOfficeAsync(buffer: Buffer, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();

  try {
    switch (ext) {
      case ".pdf":
        const pdfData = await pdfParse(buffer);
        return pdfData.text;

      case ".docx":
        const result = await mammoth.extractRawText({ buffer });
        return result.value;

      case ".doc":
        return "[❌] Fichier .doc non supporté sans bibliothèque propriétaire.";

      default:
        return "[❌] Format non supporté : " + ext;
    }
  } catch (error) {
    console.error("❌ Erreur d’analyse :", error);
    return "[❌] Erreur d’analyse du document.";
  }
}
