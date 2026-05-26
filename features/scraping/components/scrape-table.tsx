import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { ScrapeResponse, ScrapeResult } from "@/types/scraping"

interface ScrapeTableProps {
    data: ScrapeResponse | null
    isLoading?: boolean
    onSelect?: (result: ScrapeResult) => void
}

export function ScrapeTable({
    data,
    isLoading,
    onSelect
}: ScrapeTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                Scraping TikTok data...
            </div>
        )
    }

    if (!data || data.results.length === 0) {
        return (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                No scraping results yet.
            </div>
        )
    }

    return (
        <div className="rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            URL
                        </TableHead>

                        <TableHead>
                            Alt Text
                        </TableHead>

                        <TableHead>
                            Views
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.results.map(
                        (result, index) => (
                            <TableRow
                                key={index}
                                className="cursor-pointer"
                                onClick={() =>
                                    onSelect?.(result)
                                }
                            >
                                <TableCell className="max-w-62.5 truncate">
                                    {result.url ? (
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            Open TikTok
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>

                                <TableCell className="max-w-100 truncate">
                                    {result.alt_text
                                        ? result.alt_text.slice(0, 80) + "..."
                                        : "-"}
                                </TableCell>

                                <TableCell>
                                    {result.views ?? "-"}
                                </TableCell>

                                <TableCell>
                                    <Badge>
                                        {result.extraction_status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    )
}