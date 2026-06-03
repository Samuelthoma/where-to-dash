import { createClient } from "@/lib/client";

export async function rejectRawData(id: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("raw_tiktok_data")
    .update({
      cleaning_status: "rejected",
      extraction_status: "done",
    })
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}
