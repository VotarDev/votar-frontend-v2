import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  /** 1-based. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Page numbers to show: first, last, and the pages around the current one. */
const pageItems = (page: number, total: number): (number | "…")[] => {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const items: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("…");
    items.push(p);
  });
  return items;
};

const navButton =
  "flex h-9 min-w-[2.25rem] items-center justify-center rounded-md px-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(navButton, "text-muted-foreground hover:bg-muted")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pageItems(page, totalPages).map((item, i) =>
        item === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              navButton,
              item === page
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(navButton, "text-muted-foreground hover:bg-muted")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
