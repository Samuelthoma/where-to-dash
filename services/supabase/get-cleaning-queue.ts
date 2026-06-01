import { supabase } from "@/lib/supabase";

interface GetCleaningQueueParams {
  page?: number;
  pageSize?: number;
}

export async function getCleaningQueue({
  page = 1,
  pageSize = 10,
}: GetCleaningQueueParams = {}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("raw_tiktok_data")
    .select("*", { count: "exact" })
    .in("extraction_status", ["queued", "processing", "failed"])
    .order("status_rank", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) throw error;

  return {
    data,
    totalCount: count || 0,
  };
}
