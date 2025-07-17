// src/app/api/airtable-insert/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { parseOfficeAsync } from "officeparser";
import { extractCVData } from "@/utils/extractCVData";
import Airtable from "airtable";

const f = createUploadthing();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID!;

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

export const OurFileRouter = {
  cvUploader: f({
    "application/pdf": { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" }, // .docx
    "application/zip": { maxFileSize: "10MB" }, // optionnel
  }).onUploadComplete(async ({ file }) => {
    try {
      console.log("✅ Fichier reçu :", file);

      // Téléchargement du fichier UploadThing (ufsUrl)
      const fileResponse = await fetch(file.ufsUrl);
      const arrayBuffer = await fileResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extraction du texte
      const rawText = await parseOfficeAsync(buffer);
      console.log("🧠 Texte extrait du fichier :", rawText.slice(0, 500), "...");

      // Analyse des données
      const parsed = extractCVData(rawText);

      // Enregistrement dans Airtable
      const created = await base(AIRTABLE_TABLE_ID).create([
        {
          fields: {
            "Candidate Name": file.name.split(".")[0],
            "Email address": parsed.email,
            "Phone Number": parsed.phone,
            "Resume URL": file.ufsUrl,
            "Skills": parsed.skills.join(", "),
            "Experiences": parsed.experiences,
            "Soft Skills": parsed.softSkills.join(", "),
            "Score": parsed.score,
            "Application Date": new Date().toISOString().split("T")[0],
          },
        },
      ]);

      console.log("📬 Données envoyées à Airtable : ✅", created[0].id);
      return { uploadedUrl: file.ufsUrl };
    } catch (err) {
      console.error("❌ Erreur lors de l’analyse ou de l’envoi :", err);
      throw new UploadThingError("Erreur lors du traitement du fichier.");
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;

// Debug en local (facultatif)
console.log("🔐 UploadThing App ID:", process.env.UPLOADTHING_APP_ID);
console.log("🔐 UploadThing Secret:", process.env.UPLOADTHING_SECRET);

/*import { parseOfficeAsync } from "officeparser";

const f = createUploadthing();

export const OurFileRouter = {
  cvUploader: f({
    "application/pdf": { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" },
    "application/zip": { maxFileSize: "10MB" },
  }).onUploadComplete(async ({ file }) => {
    console.log("✅ Fichier reçu :", file);

    const response = await fetch(file.url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const text = await parseOfficeAsync(buffer);
    console.log("🧠 Contenu extrait :", text?.text?.slice(0, 500)); // aperçu

    return { uploadedUrl: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;


console.log("🔐 UploadThing App ID:", process.env.UPLOADTHING_APP_ID);
console.log("🔐 UploadThing Secret:", process.env.UPLOADTHING_SECRET);
*/