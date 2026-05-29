import { supabase } from "@/lib/supabase";

export async function rejectRawData(id: string) {
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
