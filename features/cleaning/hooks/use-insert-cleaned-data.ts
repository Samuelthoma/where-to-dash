import {
  cleanRawData,
  updateCleanStatus,
} from "@/services/supabase/clean-raw-data";
import { CleanedData } from "@/types/cleaned-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useInsertCleanedData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (result: CleanedData) => cleanRawData(result),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cleaned-data"],
      });
    },
  });
}

export function useUpdateCleanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateCleanStatus(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["raw-data"],
      });
    },
  });
}
