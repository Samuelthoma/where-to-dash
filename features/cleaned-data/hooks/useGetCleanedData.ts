import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCleanedData } from "@/services/supabase/get-cleaned-data";

export function useGetCleanedData(page: number, pageSize: number = 10) {
  return useQuery({
    queryKey: ["cleaned-data", page, pageSize],
    queryFn: () => getCleanedData(page, pageSize),
    placeholderData: keepPreviousData,
  });
}