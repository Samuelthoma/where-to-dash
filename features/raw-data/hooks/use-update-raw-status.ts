import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateRawStatus } from "@/services/supabase/update-raw-status"

export function useUpdateRawStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      rank
    }: {
      id: string
      status: string
      rank: number
    }) => updateRawStatus(id, status, rank),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["raw-data"],
      })
    },
  })
}