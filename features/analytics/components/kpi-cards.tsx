import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, AlertCircle, BrainCircuit } from "lucide-react";

interface KpiCardsProps {
  totalCleaned: number;
  totalQueued: number;
  avgConfidence: number;
}

export function KpiCards({
  totalCleaned,
  totalQueued,
  avgConfidence,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gold Standard Rows
          </CardTitle>
          <Database className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalCleaned.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total clean locations extracted
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Needs Manual Review
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalQueued.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Items waiting in the cleaning queue
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            AI Average Confidence
          </CardTitle>
          <BrainCircuit className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {Math.round(avgConfidence * 100)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all cleaned extractions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
