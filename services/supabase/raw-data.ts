import { supabase } from "@/lib/supabase"

import { ScrapeResult } from "@/types/scraping"

export async function saveRawResults(
    query: string,
    results: ScrapeResult[]
) {
    const payload = results.map((result) => ({
        source_query: query,

        url: result.url,

        alt_text: result.alt_text,

        views: result.views,

        extraction_status:
            result.extraction_status,

        scraped_at: result.scraped_at,
        thumbnail_url: result.thumbnail_url,
        media_type: result.media_type
    }))

    const { data, error } =
        await supabase
            .from("raw_tiktok_data")
            .upsert(payload, {
                onConflict: "url",
                ignoreDuplicates: true,
            })
            .select()

    if (error) {
        throw error
    }

    return {
        insertedCount:
            data?.length ?? 0,
    }
}