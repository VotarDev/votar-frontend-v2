import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface BallotStatusCardProps {
  icon: LucideIcon;
  tone?: "info" | "danger" | "neutral";
  title: string;
  description: React.ReactNode;
  /** e.g. the start or end time. */
  detailLabel?: string;
  detail?: React.ReactNode;
  detailHint?: React.ReactNode;
}

const TONES = {
  info: { ring: "bg-blue-50 text-primary", box: "bg-blue-50", text: "text-primary" },
  danger: { ring: "bg-red-50 text-red-500", box: "bg-red-50", text: "text-red-600" },
  neutral: { ring: "bg-muted text-muted-foreground", box: "bg-muted", text: "text-foreground" },
};

/** A centred card for "not started", "ended", "no access" and similar. */
const BallotStatusCard = ({
  icon: Icon,
  tone = "info",
  title,
  description,
  detailLabel,
  detail,
  detailHint,
}: BallotStatusCardProps) => {
  const colours = TONES[tone];
  return (
    <div className="flex justify-center px-4 py-8 smm:py-10 lg:py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 text-center shadow-sm smm:p-10">
        <div
          className={cn(
            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full",
            colours.ring,
          )}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-foreground smm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {detail && (
          <div className={cn("mt-6 rounded-xl p-4", colours.box)}>
            {detailLabel && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {detailLabel}
              </p>
            )}
            <p className={cn("break-words font-bold", colours.text)}>{detail}</p>
            {detailHint && (
              <p className="mt-2 text-xs text-muted-foreground">{detailHint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BallotStatusCard;
