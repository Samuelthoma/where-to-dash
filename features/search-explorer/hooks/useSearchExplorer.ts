import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CleanedTikTokData } from "@/types/cleaned-data";

export function useSearchExplorer(
  searchQuery: string,
  selectedCategories: string[],
  minConfidence: number,
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: [
      "search-explorer", 
      searchQuery, 
      selectedCategories, 
      minConfidence, 
      page, 
      pageSize
    ],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("cleaned_tiktok_data")
        .select("*", { count: "exact" })
        .gte("confidence", minConfidence)
        .order("created_at", { ascending: false });

      if (selectedCategories.length > 0) {
        query = query.in("category", selectedCategories);
      }

      if (searchQuery) {
        query = query.or(
          `place_name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,caption.ilike.%${searchQuery}%`
        );
      }

      const { data, count, error } = await query.range(from, to);
      if (error) throw error;
      
      return {
        data: (data || []) as CleanedTikTokData[],
        total: count || 0,
      };
    },
    placeholderData: keepPreviousData, 
  });
}