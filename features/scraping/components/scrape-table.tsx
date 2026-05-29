"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrapeResponse, ScrapeResult } from "@/types/scraping";
import { getStatusBadge } from "@/utils/statusBadgeUtil";
import { ExternalLink, Inbox, Loader2 } from "lucide-react";

interface ScrapeTableProps {
  data: ScrapeResponse | null;
  isLoading?: boolean;
  onSelect?: (result: ScrapeResult) => void;
}

export function ScrapeTable({ data, isLoading, onSelect }: ScrapeTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/20">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary/60" />
        <p className="text-sm font-medium text-foreground">Scraping TikTok...</p>
        <p className="text-sm text-muted-foreground">This might take a moment.</p>
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/20">
        <Inbox className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">No scraping results yet</p>
        <p className="text-sm text-muted-foreground">Run a new query to see data here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground">URL</TableHead>
            <TableHead className="font-semibold text-foreground">Alt Text</TableHead>
            <TableHead className="font-semibold text-foreground">Views</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.results.map((result, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onSelect?.(result)}
            >
              <TableCell className="font-medium whitespace-nowrap">
                {result.url ? (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    Open TikTok
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell 
                className="max-w-50 sm:max-w-75 md:max-w-100 truncate text-muted-foreground"
                title={result.alt_text || "No alt text"}
              >
                {result.alt_text ?? "—"}
              </TableCell>

              <TableCell className="tabular-nums">
                {result.views ? result.views.toLocaleString() : "—"}
              </TableCell>

              <TableCell className="text-right">
                <Badge 
                  variant="outline" 
                  className={`capitalize ${getStatusBadge(result.extraction_status)}`}
                >
                  {result.extraction_status || "Unknown"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}