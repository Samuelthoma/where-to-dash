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

import { RawTikTokData } from "@/types/raw-data";
import { getStatusBadge } from "@/utils/statusBadgeUtil";
import { Inbox, Image as ImageIcon, Video } from "lucide-react";

interface Props {
  data?: RawTikTokData[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onClean: (row: RawTikTokData) => void;
  onFail?: (row: RawTikTokData) => void;
}

export function CleaningQueueTable({
  data,
  onClean,
  isLoading,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center text-muted-foreground bg-muted/20">
        <Inbox className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">Queue is empty</p>
        <p className="text-sm">No items currently waiting for cleaning.</p>
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
              Status
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Media Type
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
              <TableCell className="font-medium">{row.source_query}</TableCell>

              <TableCell
                className="max-w-50 sm:max-w-75 truncate text-muted-foreground"
                title={row.alt_text ?? "No caption"}
              >
                {row.alt_text ?? "—"}
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusBadge(row.extraction_status)}`}
                >
                  {row.extraction_status}
                </Badge>
              </TableCell>

              <TableCell>
                {row.media_type === "photo" && (
                  <Badge
                    variant="outline"
                    className="bg-sky-50 text-sky-700 hover:bg-sky-50 border-sky-200 gap-1.5 py-0.5"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Photo
                  </Badge>
                )}

                {row.media_type === "video" && (
                  <Badge
                    variant="outline"
                    className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5 py-0.5"
                  >
                    <Video className="h-3 w-3" />
                    Video
                  </Badge>
                )}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClean(row)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Clean
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
            of <span className="font-medium text-foreground">{totalCount}</span>{" "}
            entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
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
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
