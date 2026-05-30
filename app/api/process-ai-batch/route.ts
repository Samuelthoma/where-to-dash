import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { extractLocationsBatch } from "@/services/ai/extract-location"; 

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ message: "No items provided", count: 0 });
    }

    const { data: rawItems, error } = await supabase
      .from("raw_tiktok_data")
      .select("*")
      .in("id", ids)
      .eq("extraction_status", "new");

    if (error) throw error;

    if (!rawItems || rawItems.length === 0) {
      return NextResponse.json({ message: "No valid new items found", count: 0 });
    }

    const aiInput = rawItems.map((item) => ({
      id: item.id,
      query: item.source_query,
      caption: item.alt_text || "",
    }));

    const aiResults = await extractLocationsBatch(aiInput);
    let processedCount = 0;

    for (const rawItem of rawItems) {
      const aiData = aiResults.find((r) => r.id === rawItem.id);

      if (!aiData) {
        await supabase.from("raw_tiktok_data").update({ extraction_status: "queued" }).eq("id", rawItem.id);
        continue;
      }

      if (aiData.confidence >= 0.8 && aiData.place_name) {
        
        await supabase.from("cleaned_tiktok_data").insert({
          raw_id: rawItem.id,
          url: rawItem.url || "", 
          caption: rawItem.alt_text,
          category: aiData.category,
          place_name: aiData.place_name,
          city: aiData.city,
          province: aiData.province,
          confidence: aiData.confidence,
        });

        await supabase.from("raw_tiktok_data")
          .update({ extraction_status: "done", cleaning_status: "cleaned" })
          .eq("id", rawItem.id);

      } else {
        await supabase.from("raw_tiktok_data")
          .update({ extraction_status: "queued" })
          .eq("id", rawItem.id);
      }
      
      processedCount++;
    }

    return NextResponse.json({ 
      message: "Batch processed successfully", 
      count: processedCount 
    });

  } catch (error) {
    console.error("AI Batch processing error:", error);
    return NextResponse.json(
      { error: "Failed to process batch" }, 
      { status: 500 }
    );
  }
}