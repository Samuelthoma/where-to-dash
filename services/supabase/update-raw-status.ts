import { supabase } from "@/lib/supabase"

export async function updateRawStatus(
  id: string,
  status: string,
  rank: number
) {
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