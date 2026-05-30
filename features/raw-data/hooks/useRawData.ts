import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getRawData } from "@/services/supabase/get-raw-data";

export function useRawData(page: number, pageSize: number = 0) {
  return useQuery({
    queryKey: ["raw-data", page, pageSize],
    queryFn: () => getRawData(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
