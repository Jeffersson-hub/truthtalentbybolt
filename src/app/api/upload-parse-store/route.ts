// src/app/api/parse-cv/parse-analyze.ts

import { extractCVData } from "../../../utils/extractCVData";
import { insertIntoAirtable } from "../../../utils/airtable"; // À créer si besoin
import { parseOfficeAsync } from "../../../lib/officeparser";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const body = await req.json(); // contient { url, filename }

  const buffer = await fetch(body.url).then(res => res.arrayBuffer());
  const rawText = await parseOfficeAsync(Buffer.from(buffer), body.filename);
  
  const parsed = extractCVData(rawText);

  // Fusionner avec les données
  const dataToSend = {
    candidateName: "À compléter", // ou à déduire d’une ligne en haut du texte
    resumeUrl: body.url,
    rawText,
    ...parsed,
  };

  await insertIntoAirtable(dataToSend); // Envoie vers Airtable

  return NextResponse.json({ success: true });
}
