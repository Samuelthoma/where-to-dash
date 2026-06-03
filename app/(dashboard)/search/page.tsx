"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useSearchExplorer } from "@/features/search-explorer/hooks/useSearchExplorer";
import { FilterSidebar } from "../../../features/search-explorer/components/filter-sidebar";
import { PlaceCard } from "../../../features/search-explorer/components/place-card";
import { PaginationFooter } from "../../../features/search-explorer/components/pagination-footer";

export default function SearchExplorerPage() {
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedMinConfidence, setAppliedMinConfidence] = useState(0.8);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: searchResult, isLoading } = useSearchExplorer(
    appliedSearch,
    appliedCategories,
    appliedMinConfidence,
    currentPage,
    pageSize,
  );

  const places = searchResult?.data || [];
  const totalCount = searchResult?.total || 0;

  const handleApplyFilters = (
    search: string,
    categories: string[],
    confidence: number,
  ) => {
    setAppliedSearch(search);
    setAppliedCategories(categories);
    setAppliedMinConfidence(confidence);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-400 mx-auto min-h-screen">
      <FilterSidebar
        initialSearch={appliedSearch}
        initialCategories={appliedCategories}
        initialMinConfidence={appliedMinConfidence}
        onApplyFilters={handleApplyFilters}
      />

      <main className="flex-1 w-full min-w-0 flex flex-col">
        {isLoading && places.length === 0 ? (
          <div className="w-full min-h-100 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Searching the database...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="w-full min-h-100 rounded-xl border border-dashed flex flex-col items-center justify-center bg-muted/20 text-muted-foreground">
            <Sparkles className="h-10 w-10 mb-4 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No places found</p>
            <p className="text-sm">
              Try adjusting your filters and clicking Apply Filters.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {totalCount > 0 && (
              <PaginationFooter
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
