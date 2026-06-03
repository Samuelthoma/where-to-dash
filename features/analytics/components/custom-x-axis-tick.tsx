import { categories } from "@/types/categories";
import { Sparkles } from "lucide-react";

export const CustomXAxisTick = ({ x, y, payload }: any) => {
  const category = categories.find((c) => c.label === payload.value);
  const Icon = category?.icon || Sparkles;

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-40" y="0" width="80" height="60">
        <div className="flex flex-col items-center justify-start pt-2 w-full h-full">
          <Icon className="h-4 w-4 text-muted-foreground mb-1 shrink-0" />
          <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight line-clamp-2 px-1">
            {payload.value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};
