import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";

// Same destinations as the old "Proceed to …" links.
const PLANS = [
  { label: "Free Votar & credits", href: "/admin/free-pro-meeting" },
  { label: "Votar Pro", href: "/admin/free-pro-meeting/pro" },
  { label: "Votar Meeting", href: null },
];

/** Switch between the plan panels. Votar Meeting isn't available yet. */
const PlanSwitcher = () => {
  const { pathname } = useRouter();
  return (
    <nav
      aria-label="Plans"
      className="flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 smm:w-fit"
    >
      {PLANS.map((plan) => {
        const active = plan.href === pathname;
        const base =
          "flex h-9 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors";
        if (!plan.href) {
          return (
            <span
              key={plan.label}
              aria-disabled="true"
              className={cn(base, "cursor-not-allowed text-muted-foreground/60")}
            >
              {plan.label}
              <span className="rounded-full bg-white/70 px-1.5 text-[10px] font-semibold uppercase">
                Soon
              </span>
            </span>
          );
        }
        return (
          <Link
            key={plan.label}
            href={plan.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              base,
              active
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {plan.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default PlanSwitcher;
