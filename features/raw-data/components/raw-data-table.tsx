"use client"

import { Badge } from "@/components/ui/badge"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import { RawTikTokData } from "@/types/raw-data"

interface RawDataTableProps {
    data: RawTikTokData[]
}

export function RawDataTable({
    data,
}: RawDataTableProps) {
    if (data.length === 0) {
        return (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                No raw data found.
            </div>
        )
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Query
                        </TableHead>

                        <TableHead>
                            Caption
                        </TableHead>

                        <TableHead>
                            Views
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.source_query}
                            </TableCell>

                            <TableCell className="max-w-100 truncate">
                                {row.alt_text ?? "-"}
                            </TableCell>

                            <TableCell>
                                {row.views ?? "-"}
                            </TableCell>

                            <TableCell>
                                <Badge>
                                    {row.extraction_status}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <Button
                                    size="sm"
                                    variant="outline"
                                >
                                    Clean
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}