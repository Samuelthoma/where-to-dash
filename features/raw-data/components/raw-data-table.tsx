"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Database, ListPlus, Sparkles, Loader2 } from "lucide-react";

import { RawTikTokData } from "@/types/raw-data";
import { useUpdateRawStatus } from "../hooks/useUpdateRawStatus";
import { useProcessAIBatch } from "../hooks/useProcessAIBatch";
import { getStatusBadge } from "@/utils/statusBadgeUtil";

interface RawDataTableProps {
  data?: RawTikTokData[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function RawDataTable({
  data = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}: RawDataTableProps) {
  const { mutateAsync: queueItem, isPending: isQueuing } = useUpdateRawStatus();
  const { mutateAsync: processBatch, isPending: isProcessingAI } =
    useProcessAIBatch();

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            const visibleIds = data.map((item) => item.id);
            processBatch(visibleIds);
          }}
          disabled={isProcessingAI || data.length === 0}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
        >
          {isProcessingAI ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Auto-Clean Page ({data.length})
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-dashed p-12 text-center bg-muted/20">
            <Database className="mb-3 h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-medium text-foreground">
              No raw data found
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-foreground">
                  Query
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Caption
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Views
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium whitespace-nowrap">
                    {row.source_query}
                  </TableCell>

                  <TableCell
                    className="max-w-50 sm:max-w-75 truncate text-muted-foreground"
                    title={row.alt_text ?? "No caption"}
                  >
                    {row.alt_text ?? "—"}
                  </TableCell>

                  <TableCell className="tabular-nums text-muted-foreground">
                    {row.views ? row.views.toLocaleString() : "—"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusBadge(row.extraction_status)}`}
                    >
                      {row.extraction_status || "Unknown"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                      disabled={isQueuing}
                      onClick={async () => {
                        try {
                          await queueItem({
                            id: row.id,
                            status: "queued",
                            rank: 1,
                          });
                          toast.success("Moved to cleaning queue");
                        } catch (e) {
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      <ListPlus className="h-3.5 w-3.5" />
                      Queue
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalCount > 0 && onPageChange && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              entries
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
