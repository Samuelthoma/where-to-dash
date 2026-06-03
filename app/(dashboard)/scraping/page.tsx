"use client";

import { useState } from "react";
import { ScrapeForm } from "@/features/scraping/components/scrape-form";
import { ScrapeTable } from "@/features/scraping/components/scrape-table";
import { ScrapeResultDialog } from "@/features/scraping/components/scrape-result-dialog";
import { ScrapeResponse, ScrapeResult } from "@/types/scraping";
import { saveRawResults } from "@/services/supabase/raw-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ScrapingPage() {
  const [results, setResults] = useState<ScrapeResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedResult, setSelectedResult] = useState<ScrapeResult | null>(
    null,
  );

  async function handleSave() {
    if (!results) return;

    try {
      const saveResult = await saveRawResults(results.query, results.results);

      toast.success(`${saveResult.insertedCount} records saved`);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save raw data");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Scraping Data</h1>

        <p className="text-sm text-muted-foreground">
          Extract TikTok data and save selected results to the raw dataset
        </p>
      </div>

      <ScrapeForm onSuccess={setResults} onLoadingChange={setIsLoading} />

      <ScrapeTable
        data={results}
        isLoading={isLoading}
        onSelect={setSelectedResult}
      />

      {results && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save to Raw Data</Button>
        </div>
      )}

      <ScrapeResultDialog
        open={!!selectedResult}
        result={selectedResult}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedResult(null);
          }
        }}
      />
    </div>
  );
}
