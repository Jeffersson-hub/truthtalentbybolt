// src/api/airtable-insert/route.ts

import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const table = base(process.env.AIRTABLE_TABLE_ID!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fields = {
      "Candidate Name": body.candidateName,
      "Email Address": body.email,
      "Phone Number": body.phone,
      "Skills": body.skills,
      "Experiences": body.experiences,
      "Soft Skills": body.softSkills,
      "Score IA": body.score,
      "Resume URL": body.resumeUrl,
      "Piece jointe": [
        {
          url: body.resumeUrl,
          filename: "cv.pdf",
          type: "application/pdf",
        },
      ],
      "Application Date": new Date(),
    };

    const created = await table.create([{ fields }]);

    console.log("✅ Candidat ajouté à Airtable :", created[0].id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Airtable error:", error);
    return NextResponse.json({ error: "Erreur lors de l'ajout dans Airtable" }, { status: 500 });
  }
}
