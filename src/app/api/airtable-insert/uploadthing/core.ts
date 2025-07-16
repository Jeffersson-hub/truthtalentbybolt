// src/app/api/airtable-insert/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const OurFileRouter = {
  cvUploader: f({
    "application/pdf": { maxFileSize: "4MB" },
    "application/msword": { maxFileSize: "4MB" }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "4MB" }, // .docx
  }).onUploadComplete(async ({ file }) => {
    console.log("✅ Fichier reçu :", file);
    return { uploadedUrl: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;


console.log("🔐 UploadThing App ID:", process.env.UPLOADTHING_APP_ID);
console.log("🔐 UploadThing Secret:", process.env.UPLOADTHING_SECRET);
