"use client";

import { MapPin, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CleanedTikTokData } from "@/types/cleaned-data";
import { categories } from "@/types/categories";

interface PlaceCardProps {
  place: CleanedTikTokData;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const categoryData = categories.find((c) => c.value === place.category);
  const CategoryIcon = categoryData?.icon || Sparkles;

  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="font-bold text-lg tracking-tight text-foreground truncate"
              title={place.place_name || ""}
            >
              {place.place_name || "Unknown Place"}
            </h3>

            <Badge variant="secondary" className="gap-1 font-medium text-xs">
              <CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
              {categoryData?.label || place.category}
            </Badge>

            <Badge
              variant="outline"
              className={`text-[10px] py-0.5 ${place.confidence! > 0.9 ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50"}`}
            >
              {Math.round(place.confidence! * 100)}% Match
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <span className="font-medium">
              {[place.city, place.province].filter(Boolean).join(", ") ||
                "Location unknown"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl leading-relaxed">
            {place.caption}
          </p>
        </div>

        <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <a
            href={place.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 transition-colors"
          >
            View TikTok
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
