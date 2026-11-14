import React from "react";
import { cn } from "@/utils/cn";

/** Accent colours for result cards, picked by position so they stay stable. */
const ACCENTS = [
  "#015CE9",
  "#b138b3",
  "#E46F24",
  "#16a34a",
  "#93241F",
  "#406b83",
];
export const accentFor = (index: number) => ACCENTS[index % ACCENTS.length];

interface PositionCardProps {
  title: string;
  /** Short note on the right of the title, e.g. the total votes. */
  meta?: React.ReactNode;
  accent?: string;
  className?: string;
  children: React.ReactNode;
}

/** A result card for one position (or one chart). */
const PositionCard = ({
  title,
  meta,
  accent = ACCENTS[0],
  className,
  children,
}: PositionCardProps) => (
  <section
    className={cn(
      "overflow-hidden rounded-xl border border-border bg-white shadow-sm",
      className,
    )}
    style={{ borderTop: `4px solid ${accent}` }}
  >
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 smm:px-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground smm:text-base">
        {title}
      </h3>
      {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
    </div>
    <div className="p-4 smm:p-6">{children}</div>
  </section>
);

export default PositionCard;
