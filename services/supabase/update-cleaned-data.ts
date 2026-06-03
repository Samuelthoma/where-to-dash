import { createClient } from "@/lib/client";

export async function updateCleanedData(
  id: string,
  updates: { category: string; address: string },
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cleaned_tiktok_data")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}
