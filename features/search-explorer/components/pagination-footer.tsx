"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationFooterProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-8 flex items-center justify-between py-4 border-t border-border/40 w-full">
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {(currentPage - 1) * pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium text-foreground">
          {Math.min(currentPage * pageSize, totalCount)}
        </span>{" "}
        of <span className="font-medium text-foreground">{totalCount}</span>{" "}
        entries
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm font-medium px-4 text-muted-foreground">
          Page <span className="text-foreground">{currentPage}</span> of{" "}
          {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
