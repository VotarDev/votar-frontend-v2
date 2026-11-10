import React from "react";
import { Bell, MessageSquareText, Search } from "lucide-react";
import { useUser } from "@/utils/hooks";

/** Desktop top bar: greeting, search and quick icons. Sits above the page content. */
const Header = (_props: { opener?: boolean }) => {
  const user = useUser();
  const profile = user?.user?.data;
  const firstName: string = profile?.userName?.split(" ")[0] || "";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-white px-6">
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold capitalize text-foreground">
          Welcome{firstName ? `, ${firstName}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* Not wired up yet: kept as before. */}
        <div className="relative hidden xl:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            name="search"
            placeholder="Search..."
            aria-label="Search"
            className="h-10 w-80 rounded-lg border border-input bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <button
          type="button"
          aria-label="Messages"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-muted hover:text-foreground"
        >
          <MessageSquareText className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
