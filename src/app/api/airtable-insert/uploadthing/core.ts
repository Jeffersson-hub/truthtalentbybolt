// src/app/api/airtable-insert/uploadthing/core.ts

import { parseOfficeAsync } from "officeparser";

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
