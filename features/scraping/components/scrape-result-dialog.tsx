"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ScrapeResult } from "@/types/scraping";
import {
  CalendarClock,
  ExternalLink,
  Search,
  Activity,
  AlignLeft,
} from "lucide-react";
import { getStatusBadge } from "@/utils/statusBadgeUtil";

interface ScrapeResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ScrapeResult | null;
}

export function ScrapeResultDialog({
  open,
  onOpenChange,
  result,
}: ScrapeResultDialogProps) {
  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg">Scrape Result Details</DialogTitle>
            {result.url && (
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  Open TikTok
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Search className="h-4 w-4" />
                <span className="font-medium">Source Query</span>
              </div>
              <p
                className="text-sm font-medium text-foreground truncate"
                title={result.source_query}
              >
                {result.source_query || "—"}
              </p>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Extraction Status</span>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusBadge(result.extraction_status)}`}
                >
                  {result.extraction_status || "Unknown"}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border p-4 space-y-1.5 bg-card sm:col-span-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CalendarClock className="h-4 w-4" />
                <span className="font-medium">Scraped At</span>
              </div>
              <p className="text-sm text-foreground">
                {result.scraped_at
                  ? new Date(result.scraped_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlignLeft className="h-4 w-4 text-muted-foreground" />
              <h3>Full Caption</h3>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4 min-h-25 max-h-62.5 overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {result.alt_text || (
                  <span className="text-muted-foreground italic">
                    No caption provided for this video.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
