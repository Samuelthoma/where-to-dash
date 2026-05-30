"use client";

import { RawDataTable } from "@/features/raw-data/components/raw-data-table";

import { useRawData } from "@/features/raw-data/hooks/useRawData";
import { useState } from "react";

export default function RawDataPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useRawData(page, pageSize);

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Loading raw data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-sm text-red-500">
        Failed to load raw data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Raw Data</h1>

        <p className="text-sm text-muted-foreground">
          Untouched TikTok scraping results
        </p>
      </div>

      <RawDataTable
        data={data?.data}
        totalCount={data?.total || 0}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
