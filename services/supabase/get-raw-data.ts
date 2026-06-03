import { createClient } from "@/lib/client";
import { RawTikTokData } from "@/types/raw-data";

export async function getRawData(page: number = 1, pageSize: number = 10) {
  const supabase = createClient();
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("raw_tiktok_data")
    .select("*", { count: "exact" })
    .eq("extraction_status", "new")
    .order("status_rank", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data || []) as RawTikTokData[],
    total: count || 0,
  };
}