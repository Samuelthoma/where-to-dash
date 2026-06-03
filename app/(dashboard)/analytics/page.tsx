"use client";

import { CategoryChart } from "@/features/analytics/components/category-chart";
import { ExpansionSlot } from "@/features/analytics/components/expansion-slot";
import { GeographicChart } from "@/features/analytics/components/geographic-chart";
import { KpiCards } from "@/features/analytics/components/kpi-cards";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { Loader2 } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="mb-4 h-8 w-8 animate-spin" />
        <p>Crunching the dataset...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-400 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dataset Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Monitor the health and balance of your ML training data.
        </p>
      </div>

      <KpiCards
        totalCleaned={data.totalCleaned}
        totalQueued={data.totalQueued}
        avgConfidence={data.avgConfidence}
      />

      <CategoryChart data={data.categoryChartData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GeographicChart data={data.cityChartData} />
        <ExpansionSlot />
      </div>
    </div>
  );
}
