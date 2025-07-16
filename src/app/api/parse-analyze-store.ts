// src/app/api/parse-analyze

import { NextRequest, NextResponse } from "next/server";
import { parseOfficeAsync } from "@/lib/officeparser";
import { extractCVData } from "@/utils/extractCVData";
import { insertIntoAirtable } from "@/utils/airtable";

export async function POST(req: NextRequest) {
  const body = await req.json(); // { url, filename }

  const buffer = await fetch(body.url).then(res => res.arrayBuffer());
  const rawText = await parseOfficeAsync(Buffer.from(buffer), body.filename);

  const parsed = extractCVData(rawText);

  const dataToInsert = {
    candidateName: "À compléter",
    resumeUrl: body.url,
    rawText,
    ...parsed,
  };

  await insertIntoAirtable(dataToInsert);

  return NextResponse.json({ success: true, parsed });
}
