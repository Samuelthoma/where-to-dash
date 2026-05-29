import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectRawData } from "@/services/supabase/reject-raw-data";

export function useRejectRawData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => rejectRawData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["raw-data"],
      });
    },
  });
}