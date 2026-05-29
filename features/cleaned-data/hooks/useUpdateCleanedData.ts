import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCleanedData } from "@/services/supabase/update-cleaned-data";

export function useUpdateCleanedData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { category: string; address: string } }) =>
      updateCleanedData(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaned-data"] });
    },
  });
}