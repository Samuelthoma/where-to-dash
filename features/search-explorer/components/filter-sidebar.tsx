"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { categories } from "@/types/categories";

interface FilterSidebarProps {
  initialSearch: string;
  initialCategories: string[];
  initialMinConfidence: number;
  onApplyFilters: (
    search: string,
    categories: string[],
    confidence: number,
  ) => void;
}

export function FilterSidebar({
  initialSearch,
  initialCategories,
  initialMinConfidence,
  onApplyFilters,
}: FilterSidebarProps) {
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [localCategories, setLocalCategories] =
    useState<string[]>(initialCategories);
  const [localMinConfidence, setLocalMinConfidence] = useState([
    initialMinConfidence,
  ]);

  const toggleCategory = (categoryValue: string) => {
    setLocalCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue],
    );
  };

  const handleClear = () => {
    setLocalSearch("");
    setLocalCategories([]);
    setLocalMinConfidence([0.8]);
    onApplyFilters("", [], 0.8);
  };

  return (
    <aside className="w-full md:w-72 shrink-0 space-y-6 md:border-r md:pr-6 border-border/40 md:sticky md:top-6 md:self-start">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Discovery</h1>
        <p className="text-sm text-muted-foreground">
          Find the best viral spots.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            onApplyFilters(localSearch, localCategories, localMinConfidence[0])
          }
          className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
        <Button onClick={handleClear} variant="outline" className="text-xs">
          Clear
        </Button>
      </div>

      <hr className="border-border/60" />

      <div className="space-y-3">
        <label className="text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="City, place, or vibe..."
            className="pl-9"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">AI Confidence Minimum</label>
          <span className="text-xs font-bold text-indigo-600">
            {Math.round(localMinConfidence[0] * 100)}%
          </span>
        </div>
        <Slider
          defaultValue={[0.8]}
          max={1}
          min={0}
          step={0.05}
          value={localMinConfidence}
          onValueChange={setLocalMinConfidence}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Categories</label>
        <ScrollArea className="h-75 pr-4">
          <div className="space-y-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.value}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    id={category.value}
                    checked={localCategories.includes(category.value)}
                    onCheckedChange={() => toggleCategory(category.value)}
                  />
                  <label
                    htmlFor={category.value}
                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {category.label}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
