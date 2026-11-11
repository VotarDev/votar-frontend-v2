import React, { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import SidebarContent from "./SidebarContent";

interface SideBarProps {
  /** Expanded (true) or collapsed to icons (false). */
  opener?: boolean;
  setOpener: Dispatch<SetStateAction<boolean>>;
}

/** Desktop sidebar. The mobile menu (DashboardNavbar) shows the same content. */
const SideBar = ({ opener = true, setOpener }: SideBarProps) => (
  <aside
    className={cn(
      "relative flex h-screen shrink-0 flex-col border-r border-border bg-white transition-[width] duration-300 ease-in-out",
      opener ? "w-[264px]" : "w-[76px]"
    )}
  >
    <SidebarContent collapsed={!opener} />
    <button
      type="button"
      onClick={() => setOpener(!opener)}
      aria-label={opener ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={opener}
      className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white text-slate-500 shadow-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {opener ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  </aside>
);

export default SideBar;
