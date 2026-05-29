import { supabase } from "@/lib/supabase"

export async function getCleaningQueue() {
  const { data, error } = await supabase
    .from("raw_tiktok_data")
    .select("*")
    .in("extraction_status", [
      "queued",
      "processing",
      "failed",
    ])
    .order("status_rank", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return data
}