import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Supabase server client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // MUST use service key for uploads
    );

    // unique file path
    const filePath = `blogs/${Date.now()}-${file.name}`;

    // Upload
    const { data, error } = await supabase.storage
      .from("iater2025-storage")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from("iater2025-storage")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      filename: file.name,
      type: file.type,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
