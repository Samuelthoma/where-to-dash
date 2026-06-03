import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/client";
import { categories } from "@/types/categories";

export function useAnalytics() {
  return useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: cleanedData, error: cleanedError } = await supabase
        .from("cleaned_tiktok_data")
        .select("category, confidence, city");

      if (cleanedError) throw cleanedError;

      const { count: queuedCount, error: queueError } = await supabase
        .from("raw_tiktok_data")
        .select("*", { count: "exact", head: true })
        .eq("extraction_status", "queued");

      if (queueError) throw queueError;

      const safeData = cleanedData || [];

      const categoryCounts = safeData.reduce(
        (acc, row) => {
          acc[row.category] = (acc[row.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const categoryChartData = categories
        .map((cat) => ({
          name: cat.label,
          count: categoryCounts[cat.value] || 0,
        }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count);

      const totalConfidence = safeData.reduce(
        (sum, row) => sum + row.confidence,
        0,
      );
      const avgConfidence =
        safeData.length > 0 ? totalConfidence / safeData.length : 0;

      const cityCounts = safeData.reduce(
        (acc, row) => {
          if (row.city) {
            const cleanCity = row.city.trim();
            acc[cleanCity] = (acc[cleanCity] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      const cityChartData = Object.entries(cityCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalCleaned: safeData.length,
        totalQueued: queuedCount || 0,
        avgConfidence,
        categoryChartData,
        cityChartData,
      };
    },
  });
}
