import { createClient } from "@/lib/client";
import { CleanedTikTokData } from "@/types/cleaned-data";

export async function getCleanedData(page: number = 1, pageSize: number = 10) {
  const supabase = createClient();
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("cleaned_tiktok_data")
    .select("*", { count: "exact" })
    .order("cleaned_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: (data || []) as CleanedTikTokData[],
    total: count || 0,
  };
}