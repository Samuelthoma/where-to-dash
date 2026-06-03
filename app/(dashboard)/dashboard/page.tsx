"use client";

import { ActivityFeed } from "@/features/dashboard/components/activity-feed";
import { AttentionRequired } from "@/features/dashboard/components/attention-required";
import { QuickActions } from "@/features/dashboard/components/quick-actiion";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  return (
    <div className="max-w-400 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-1">
          Manage your scraping pipeline, run AI batches, and export your
          dataset.
        </p>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <AttentionRequired
          isLoading={isLoading}
          queueCount={data?.queueCount}
          lowCategories={data?.lowCategories}
        />
        <ActivityFeed isLoading={isLoading} feed={data?.activityFeed} />
      </div>
    </div>
  );
}
