import React from "react";
import { Badge, type BadgeProps } from "@/src/components/ui/badge";
import type { ElectionStatus } from "@/utils/electionTime";

const statusDisplay: Record<
  ElectionStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  active: { label: "Live", variant: "success" },
  not_started: { label: "Upcoming", variant: "secondary" },
  ended: { label: "Ended", variant: "muted" },
};

const ElectionStatusBadge = ({ status }: { status: ElectionStatus | null }) => {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const { label, variant } = statusDisplay[status];
  return (
    <Badge variant={variant}>
      {status === "active" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
      )}
      {label}
    </Badge>
  );
};

export default ElectionStatusBadge;
