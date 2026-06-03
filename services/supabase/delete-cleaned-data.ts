import { createClient } from "@/lib/client";

export async function deleteCleanedData(id: string) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("cleaned_tiktok_data")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}