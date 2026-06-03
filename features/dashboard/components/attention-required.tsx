import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Activity,
  CheckCircle2,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface AttentionRequiredProps {
  isLoading: boolean;
  queueCount?: number;
  lowCategories?: { name: string; count: number }[];
}

export function AttentionRequired({
  isLoading,
  queueCount,
  lowCategories,
}: AttentionRequiredProps) {
  return (
    <Card className="lg:col-span-2 shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Attention Required</CardTitle>
          <CardDescription>Items needing manual intervention.</CardDescription>
        </div>
        <AlertCircle className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {queueCount ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/50 dark:bg-amber-950/10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      Manual Review Queue
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You have {queueCount} items waiting.
                    </p>
                  </div>
                </div>
                <Link href="/cleaning">
                  <Button variant="outline" size="sm" className="gap-1">
                    Review Now <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Queue is Empty</h4>
                    <p className="text-sm text-muted-foreground">
                      All scraped items have been processed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {lowCategories?.slice(0, 3).map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      Low Category Balance
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {cat.name} has only {cat.count} entries.
                    </p>
                  </div>
                </div>
                <Link href="/scraping">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                  >
                    Scrape More
                  </Badge>
                </Link>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
