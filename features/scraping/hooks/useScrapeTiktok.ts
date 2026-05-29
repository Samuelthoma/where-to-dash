import { useMutation } from "@tanstack/react-query"

import { scrapeTikTok } from "@/services/api/scraping"

export function useScrapeTikTok() {
  return useMutation({
    mutationFn: scrapeTikTok,
  })
}