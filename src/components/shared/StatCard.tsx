import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/utils/cn";

const tones = {
  primary: "bg-secondary text-primary",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  muted: "bg-muted text-muted-foreground",
} as const;

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: string;
  isLoading?: boolean;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  isLoading,
}: StatCardProps) => (
  <Card className="p-4 lg:p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          tones[tone]
        )}
      >
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
    </div>
    {isLoading ? (
      <Skeleton className="mt-2 h-8 w-16" />
    ) : (
      <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    )}
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </Card>
);

export default StatCard;
