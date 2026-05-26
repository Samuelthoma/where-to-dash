"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { ScrapeResult } from "@/types/scraping"

interface ScrapeResultDialogProps {
  open: boolean
  onOpenChange: (
    open: boolean
  ) => void

  result: ScrapeResult | null
}

export function ScrapeResultDialog({
  open,
  onOpenChange,
  result,
}: ScrapeResultDialogProps) {
  if (!result) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Scrape Result Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="rounded-xl border p-4">
            <h3 className="mb-4 font-semibold">
              Metadata
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">
                  Query:
                </span>{" "}
                {result.source_query}
              </p>

              <p>
                <span className="font-medium">
                  Status:
                </span>{" "}
                {result.extraction_status}
              </p>

              <p>
                <span className="font-medium">
                  Scraped At:
                </span>{" "}
                {new Date(
                  result.scraped_at
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="mb-4 font-semibold">
              Full Caption
            </h3>

            <p className="text-sm whitespace-pre-wrap">
              {result.alt_text ?? "No caption"}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="mb-4 font-semibold">
              Source
            </h3>

            <a
              href={result.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 underline"
            >
              Open TikTok Video
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}