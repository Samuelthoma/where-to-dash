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
import { Button } from "@/components/ui/button";
import { RawTikTokData } from "@/types/raw-data";
import { useUpdateRawStatus } from "../hooks/useUpdateRawStatus";
import { toast } from "sonner";
import { Database, ListPlus } from "lucide-react";
import { getStatusBadge } from "@/utils/statusBadgeUtil";

interface RawDataTableProps {
  data: RawTikTokData[];
}

export function RawDataTable({ data }: RawDataTableProps) {
  const { mutateAsync, isPending } = useUpdateRawStatus();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-muted/20">
        <Database className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">No raw data found</p>
        <p className="text-sm text-muted-foreground">
          Scrape some TikTok data to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
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
                  disabled={isPending}
                  onClick={async () => {
                    try {
                      await mutateAsync({
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
    </div>
  );
}
