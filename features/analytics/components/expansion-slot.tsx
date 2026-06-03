import { Card } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export function ExpansionSlot() {
  return (
    <Card className="shadow-sm border-border/50 border-dashed bg-muted/20 flex flex-col items-center justify-center p-6 text-center">
      <BrainCircuit className="h-10 w-10 text-muted-foreground/40 mb-3" />
      <h3 className="font-semibold text-foreground">Model Training Status</h3>
      <p className="text-sm text-muted-foreground max-w-62.5 mt-2">
        Once you reach 1,500 total rows, we can add a button here to trigger the
        SLM export pipeline.
      </p>
    </Card>
  );
}
