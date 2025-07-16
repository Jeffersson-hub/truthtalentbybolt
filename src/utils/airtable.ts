// src/utils/airtable.ts

import Airtable, { Attachment } from "airtable";
import { Candidate } from "@/types";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const table = base(process.env.AIRTABLE_TABLE_ID!);

export async function insertIntoAirtable(data: Partial<Candidate> & { resumeUrl: string; rawText?: string }) {
  const fields: Record<string, any> = {
    "Candidate Name": data.name || "Nom inconnu",
    "Email Address": data.email || "",
    "Phone Number": data.phone || "",
    "Skills": (data.skills || []).join(", "),
    "Experiences": data.experience?.toString() || "0",
    "Soft Skills": data.skills || ""
  }
}