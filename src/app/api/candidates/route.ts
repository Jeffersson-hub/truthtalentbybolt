import { NextRequest, NextResponse } from "next/server";
import { utapi } from "../../../../backend/";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const results: { name: string; url: string }[] = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });

      const uploaded = await utapi.uploadFiles(blob, {
        // Optionnel : personnalisations
        filename: file.name,
      });

      if (!uploaded?.url) {
        throw new Error("UploadThing: Échec de l’upload");
      }

      results.push({ name: file.name, url: uploaded.url });
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("❌ UploadThing API error:", err);
    return NextResponse.json({ error: "Erreur d’upload" }, { status: 500 });
  }
}
