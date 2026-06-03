import { createClient } from "@/lib/client";

export async function updateRawStatus(
  id: string,
  status: string,
  rank: number
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("raw_tiktok_data")
    .update({
      extraction_status: status,
      status_rank: rank,
    })
    .eq("id", id)
    .select()

  if (error) throw error

  return data
}