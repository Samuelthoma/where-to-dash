import { supabase } from "@/lib/supabase"

export async function getRawData() {
  const { data, error } =
    await supabase
      .from("raw_tiktok_data")
      .select("*")
      .order("created_at", {
        ascending: false,
      })

  if (error) {
    throw error
  }

  return data
}