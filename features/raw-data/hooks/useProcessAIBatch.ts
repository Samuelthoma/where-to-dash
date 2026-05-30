import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProcessAIBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/process-ai-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process batch");
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["raw-data"] });
      queryClient.invalidateQueries({ queryKey: ["cleaned-data"] });
      
      if (data.count === 0) {
        toast.info("No items were processed.");
      } else {
        toast.success(`Magic complete! Processed ${data.count} items.`);
      }
    },
    onError: () => {
      toast.error("Failed to run AI processing.");
    }
  });
}