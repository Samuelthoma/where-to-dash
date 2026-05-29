"use client"

import { RawDataTable } from "@/features/raw-data/components/raw-data-table"

import { useRawData } from "@/features/raw-data/hooks/useRawData"

export default function RawDataPage() {
  const { data, isLoading, error } =
    useRawData()

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Loading raw data...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-sm text-red-500">
        Failed to load raw data.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Raw Data
        </h1>

        <p className="text-sm text-muted-foreground">
          Untouched TikTok scraping results
        </p>
      </div>

      <RawDataTable
        data={data ?? []}
      />
    </div>
  )
}