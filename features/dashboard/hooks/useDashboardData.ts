import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/client";
import { categories } from "@/types/categories";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const supabase = createClient();
      const { count: queueCount, error: queueError } = await supabase
        .from("raw_tiktok_data")
        .select("*", { count: "exact", head: true })
        .eq("extraction_status", "queued");

      if (queueError) throw queueError;

      const { data: cleanedData, error: cleanedError } = await supabase
        .from("cleaned_tiktok_data")
        .select("category");

      if (cleanedError) throw cleanedError;

      const categoryCounts = (cleanedData || []).reduce(
        (acc, row) => {
          acc[row.category] = (acc[row.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const lowCategories = categories
        .map((cat) => ({
          name: cat.label,
          count: categoryCounts[cat.value] || 0,
        }))
        .filter((cat) => cat.count < 100)
        .sort((a, b) => a.count - b.count);

      const { data: recentRaw } = await supabase
        .from("raw_tiktok_data")
        .select("id, source_query, scraped_at")
        .order("scraped_at", { ascending: false })
        .limit(5);

      const { data: recentCleaned } = await supabase
        .from("cleaned_tiktok_data")
        .select("id, place_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      const activityFeed = [
        ...(recentRaw || []).map((item) => ({
          id: `raw-${item.id}`,
          type: "scraped" as const,
          title: "New Data Scraped",
          description: `Gathered results for keyword: "${item.source_query}"`,
          timestamp: new Date(item.scraped_at).getTime(),
        })),
        ...(recentCleaned || []).map((item) => ({
          id: `clean-${item.id}`,
          type: "cleaned" as const,
          title: "Location Extracted",
          description: `AI successfully mapped: ${item.place_name}`,
          timestamp: new Date(item.created_at).getTime(),
        })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 7);

      return {
        queueCount: queueCount || 0,
        lowCategories,
        activityFeed,
      };
    },
  });
}
