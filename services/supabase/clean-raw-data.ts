import { supabase } from "@/lib/supabase";
import { CleanedData } from "@/types/cleaned-data";

export async function cleanRawData(result: CleanedData) {
  const payload = {
    raw_id: result.raw_id,
    url: result.url,
    caption: result.caption,
    views: result.views,
    category: result.category,
    place_name: result.place_name,
    address: result.address,
    city: result.city,
    province: result.province,
    country: result.country,
    confidence: result.confidence,
  };

  const { data, error } = await supabase
    .from("cleaned_tiktok_data")
    .upsert(payload, {
      onConflict: "url",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    throw error;
  }

  return {
    insertedCount: data?.length ?? 0,
  };
}

export async function updateCleanStatus(id: string) {
  const { data, error } = await supabase
    .from("raw_tiktok_data")
    .update({
      cleaning_status: "cleaned",
      extraction_status: "done",
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}
