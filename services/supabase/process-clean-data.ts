import { supabase } from "@/lib/supabase";

export async function processCleanData(row: any, form: any) {
  const { error: insertError } = await supabase
    .from("cleaned_tiktok_data")
    .insert({
      raw_id: row.id,
      url: row.url,
      caption: row.alt_text,
      views: row.views,
      category: form.category,
      place_name: form.place_name,
      address: form.address,
      city: form.city,
      province: form.province,
      country: form.country,
      confidence: 1,
    });

  if (insertError) throw insertError;

  const { data, error: updateError } = await supabase
    .from("raw_tiktok_data")
    .update({
      cleaning_status: "cleaned",
      extraction_status: "done",
    })
    .eq("id", row.id)
    .select();

  if (updateError) throw updateError;

  return data;
}
