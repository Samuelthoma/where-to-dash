"use client";

import { CleanedDataTable } from "@/features/cleaned-data/components/cleaned-data-table";
import { useGetCleanedData } from "@/features/cleaned-data/hooks/useGetCleanedData";
import { useState } from "react";


export default function CleanedDataPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useGetCleanedData(page, pageSize);

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cleaned Data</h1>
        <p className="text-sm text-muted-foreground">
          View and manage the structured places data extracted from TikTok.
        </p>
      </div>

      {isError ? (
        <div className="p-4 text-sm text-red-800 bg-red-100 rounded-xl border border-red-200">
          Failed to load cleaned data. Please try refreshing the page.
        </div>
      ) : (
        <CleanedDataTable 
          data={data?.data} 
          isLoading={isLoading} 
          totalCount={data?.total || 0}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}