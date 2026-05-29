import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processCleanData } from "@/services/supabase/process-clean-data";

export function useProcessCleanData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ row, form }: { row: any; form: any }) =>
      processCleanData(row, form),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["raw-data"],
      });
    },
  });
}
