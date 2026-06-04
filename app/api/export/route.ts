import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(req: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const format = searchParams.get("format") || "csv";
    const minConf = parseFloat(searchParams.get("minConf") || "0.8");
    const days = searchParams.get("days") || "all";

    let query = supabase
        .from("cleaned_tiktok_data")
        .select("id, place_name, category, city, province, confidence, caption, url, created_at")
        .gte("confidence", minConf)
        .order("created_at", { ascending: false });

    if (days !== "all") {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));
        query = query.gte("created_at", dateLimit.toISOString());
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ error: "No records found matching these criteria" }, { status: 404 });
    }

    const timestamp = new Date().toISOString().split("T")[0];
    let fileContent = "";
    let contentType = "";
    let filename = "";

    if (format === "jsonl") {
        fileContent = data.map((row) => JSON.stringify(row)).join("\n");
        contentType = "application/x-ndjson";
        filename = `gold_dataset_${timestamp}.jsonl`;
    } else {
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(","),
            ...data.map((row) =>
                headers
                    .map((header) => {
                        const cell = row[header as keyof typeof row] === null ? "" : String(row[header as keyof typeof row]);
                        return `"${cell.replace(/"/g, '""')}"`;
                    })
                    .join(",")
            ),
        ];
        fileContent = csvRows.join("\n");
        contentType = "text/csv";
        filename = `gold_dataset_${timestamp}.csv`;
    }

    return new NextResponse(fileContent, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}