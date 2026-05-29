import { useQuery } from "@tanstack/react-query"
import { getCleaningQueue } from "@/services/supabase/get-cleaning-queue"

export function useCleaningQueue() {
  return useQuery({
    queryKey: ["cleaning-queue"],
    queryFn: getCleaningQueue,
  })
}