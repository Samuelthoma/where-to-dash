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
import { useState } from "react";

interface Props {
  data: RawTikTokData[];
  onClean: (row: RawTikTokData) => void;
  onFail?: (row: RawTikTokData) => void;
}

export function CleaningQueueTable({ data, onClean }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        No items in cleaning queue.
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Media Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.source_query}</TableCell>

              <TableCell className="max-w-100 truncate">
                {row.alt_text ?? "-"}
              </TableCell>

              <TableCell>
                <Badge>{row.extraction_status}</Badge>
              </TableCell>

              <TableCell>
                {row.media_type === "photo" && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Photo
                  </Badge>
                )}

                {row.media_type === "video" && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Video
                  </Badge>
                )}
              </TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClean(row)}
                >
                  Clean
                </Button>

                <Button size="sm" variant="destructive">
                  Fail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
