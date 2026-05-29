export interface ScrapeRequest {
  query: string
  limit: number
}

export interface ScrapeResult {
  url: string | null
  alt_text: string | null
  views: string | null
  scraped_at: string
  extraction_status: string
  source_query: string
  thumbnail_url: string
  media_type: string
}

export interface ScrapeResponse {
  query: string
  requested_limit: number
  result_count: number
  results: ScrapeResult[]
}