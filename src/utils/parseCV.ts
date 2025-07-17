// src/utils/parseCV.ts

import { parseOfficeAsync } from "officeparser";

export async function extractTextFromCV(filePathOrBuffer: Buffer) {
  try {
    const content = await parseOfficeAsync(filePathOrBuffer);
    return content?.text ?? "";
  } catch (e) {
    console.error("Erreur parsing :", e);
    return "";
  }
}
