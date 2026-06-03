import { extractLocationsBatch } from "@/services/ai/extract-location";
import { createClient } from "@/lib/client";

export async function processRawTikTokBatch(rawItems: any[]) {
  const supabase = createClient();
  
  try {
    if (!rawItems || rawItems.length === 0) return 0;

    const aiInput = rawItems.map((item) => ({
      id: item.id,
      query: item.source_query,
      caption: item.alt_text || "",
    }));

    const aiResults = await extractLocationsBatch(aiInput);

    let processedCount = 0;

    for (const rawItem of rawItems) {
      const aiData = aiResults.find((r) => r.id === rawItem.id);

      console.log(`\nAI Result for ID ${rawItem.id}:`);
      console.log(
        JSON.stringify(aiData || { error: "Skipped by AI" }, null, 2),
      );

      if (!aiData) {
        console.log("AI missed this item. Sending to Queue.");
        await supabase
          .from("raw_tiktok_data")
          .update({ extraction_status: "queued" })
          .eq("id", rawItem.id);
        continue;
      }

      if (aiData.confidence >= 0.8 && aiData.place_name) {
        const { error: insertError } = await supabase
          .from("cleaned_tiktok_data")
          .insert({
            raw_id: rawItem.id,
            url: rawItem.url || "",
            caption: rawItem.alt_text,
            category: aiData.category,
            place_name: aiData.place_name,
            city: aiData.city,
            province: aiData.province,
            confidence: aiData.confidence,
          });

        if (insertError) {
          console.error("Supabase Insert Error:", insertError);
          throw insertError;
        }

        await supabase
          .from("raw_tiktok_data")
          .update({ extraction_status: "done", cleaning_status: "cleaned" })
          .eq("id", rawItem.id);

        console.log("Successfully moved to Cleaned Data");
      } else {
        console.log(
          "Low confidence or missing place_name. Sending to Queue.",
        );
        await supabase
          .from("raw_tiktok_data")
          .update({ extraction_status: "queued" })
          .eq("id", rawItem.id);
      }

      processedCount++;
    }

    return processedCount;
  } catch (err) {
    console.error(`Failed to process batch:`, err);
    const ids = rawItems.map((item) => item.id);
    await supabase
      .from("raw_tiktok_data")
      .update({ extraction_status: "queued" })
      .in("id", ids);
    return 0;
  }
}
