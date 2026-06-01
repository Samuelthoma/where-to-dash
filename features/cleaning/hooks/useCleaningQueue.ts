import { useQuery } from "@tanstack/react-query"
import { getCleaningQueue } from "@/services/supabase/get-cleaning-queue"

export function useCleaningQueue(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["cleaning-queue", page, pageSize],
    queryFn: () => getCleaningQueue({ page, pageSize }),
  })
}