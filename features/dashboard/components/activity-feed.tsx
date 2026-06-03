import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Play, CheckCircle2, Clock, Loader2 } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "scraped" | "cleaned";
  title: string;
  description: string;
  timestamp: number;
}

interface ActivityFeedProps {
  isLoading: boolean;
  feed?: ActivityItem[];
}

function getRelativeTime(timestamp: number) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const daysDifference = Math.round(
    (timestamp - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const hoursDifference = Math.round(
    (timestamp - Date.now()) / (1000 * 60 * 60),
  );
  const minutesDifference = Math.round((timestamp - Date.now()) / (1000 * 60));

  if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, "day");
  if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, "hour");
  return rtf.format(minutesDifference, "minute");
}

export function ActivityFeed({ isLoading, feed }: ActivityFeedProps) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Activity Feed</CardTitle>
        <CardDescription>Recent pipeline executions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {feed?.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-0.5">
                  {activity.type === "cleaned" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5 text-indigo-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{" "}
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {feed?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity detected.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
