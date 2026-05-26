import axios from "axios"

import {
  ScrapeRequest,
  ScrapeResponse,
} from "@/types/scraping"

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,
})

export async function scrapeTikTok(
  payload: ScrapeRequest
) {
  const response =
    await api.post<ScrapeResponse>(
      "/scraper/tiktok",
      payload
    )

  return response.data
}