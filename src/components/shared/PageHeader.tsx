import React from "react";
import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Buttons or links shown on the right (below the title on small screens). */
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 smm:flex-row smm:items-end smm:justify-between",
      className
    )}
  >
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground lg:text-base">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
