import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCleanedData } from "@/services/supabase/delete-cleaned-data";

export function useDeleteCleanedData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCleanedData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaned-data"] });
    },
  });
}