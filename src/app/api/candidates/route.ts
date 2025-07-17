// src/app/api/candidates/route.ts

import { NextResponse } from "next/server";
import Airtable from "airtable";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID!;

Airtable.configure({ apiKey: AIRTABLE_API_KEY });
const base = Airtable.base(AIRTABLE_BASE_ID);

export async function GET() {
  try {
    const records = await base(AIRTABLE_TABLE_ID).select().all();

    const candidates = records.map((record: any) => ({
      id: record.id,
      name: record.fields["Candidate Name"] || "",
      email: record.fields["Email address"] || "",
      phone: record.fields["Phone Number"] || "",
      resumeUrl: record.fields["Resume URL"] || "",
      skills: (record.fields["Skills"] as string)?.split(",").map(s => s.trim()) || [],
      softSkills: (record.fields["Soft Skills"] as string)?.split(",").map(s => s.trim()) || [],
      experience: record.fields["Experiences"] || "",
      score: record.fields["Score"] || 0,
    }));

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("❌ Erreur lors de la lecture Airtable:", error);
    return NextResponse.json({ error: "Erreur lecture Airtable" }, { status: 500 });
  }
}
