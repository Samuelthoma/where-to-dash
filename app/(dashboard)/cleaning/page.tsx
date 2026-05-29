"use client";

import { useCleaningQueue } from "@/features/cleaning/hooks/use-cleaning-queue";

import { CleaningQueueTable } from "@/features/cleaning/components/cleaning-queue-table";
import { useState } from "react";
import { RawTikTokData } from "@/types/raw-data";
import { CleanDialog } from "@/features/cleaning/components/clean-dialog";
import { useQueryClient } from "@tanstack/react-query";

export default function CleaningPage() {
  const { data, isLoading, error } = useCleaningQueue();
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState<RawTikTokData | null>(null);
  const [open, setOpen] = useState(false);

  const handleClean = (row: RawTikTokData) => {
    setSelectedRow(row);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Loading cleaning queue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-sm text-red-500">
        Failed to load queue.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cleaning Queue</h1>

        <p className="text-sm text-muted-foreground">
          Items waiting for processing or review
        </p>
      </div>

      <CleaningQueueTable data={data ?? []} onClean={handleClean} />

      <CleanDialog
        open={open}
        row={selectedRow}
        onOpenChange={setOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({
            queryKey: ["cleaning-queue"],
          })
        }
      />
    </div>
  );
}
