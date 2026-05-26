import { useQuery } from "@tanstack/react-query"

import { getRawData } from "@/services/supabase/get-raw-data"

export function useRawData() {
  return useQuery({
    queryKey: ["raw-data"],

    queryFn: getRawData,
  })
}