import { supabase } from "@/lib/supabase";

export async function deleteCleanedData(id: string) {
  const { error } = await supabase
    .from("cleaned_tiktok_data")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}