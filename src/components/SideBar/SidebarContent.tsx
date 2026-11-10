import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import Cookies from "universal-cookie";
import {
  Coins,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  Package,
  PlusCircle,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import { logout } from "@/redux/features/auth/authSlice";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { useGetCreditQuery } from "@/redux/api/creditApi";
import { useCurrentUserId, useUser } from "@/utils/hooks";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/utils/cn";
import AddCreditsDialog from "./AddCreditsDialog";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Whether the item is the current page (same rules as before). */
  isActive: (pathname: string) => boolean;
}

const hasSegment = (pathname: string, segment: string) =>
  pathname.split("/").includes(segment);

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Elections",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, isActive: (p) => p === "/dashboard" },
      { label: "Create an election", href: "/create-election", icon: PlusCircle, isActive: (p) => hasSegment(p, "create-election") },
      { label: "Elections", href: "/elections", icon: Package, isActive: (p) => hasSegment(p, "elections") },
    ],
  },
  {
    label: "Voting",
    items: [
      { label: "Participate in an election", href: "/participate", icon: Users, isActive: (p) => p === "/participate" },
      { label: "Monitor an election", href: "/monitor-election", icon: LineChart, isActive: (p) => hasSegment(p, "monitor-election") },
      { label: "Votar Forms", href: "/votar-forms", icon: FileText, isActive: (p) => hasSegment(p, "votar-forms") },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserRound, isActive: (p) => p === "/profile" },
    ],
  },
];

/** Shows a tooltip with the label only when the sidebar is collapsed. */
const CollapsedTip = ({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: React.ReactElement;
}) =>
  collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  ) : (
    children
  );

interface SidebarContentProps {
  /** Icons only (desktop collapsed state). */
  collapsed?: boolean;
}

/** Logo, navigation, credits and account: shared by the desktop sidebar and the mobile menu. */
const SidebarContent = ({ collapsed = false }: SidebarContentProps) => {
  const pathname = usePathname() || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = useUser();
  const userId = useCurrentUserId();
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Shared through the RTK Query cache: one request, refreshed every 30
  // seconds and whenever the sidebar mounts.
  const { data: credit = 0, isLoading: isCreditLoading } = useGetCreditQuery(
    userId as string,
    { skip: !userId, pollingInterval: 30000, refetchOnMountOrArgChange: true }
  );

  const profile = user?.user?.data;
  const name: string = profile?.userName || user?.user?.username || "";
  const email: string = profile?.email || "";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "V";

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    new Cookies().remove("user-token", { path: "/" });
    dispatch(logout());
    dispatch(userData({}));

    if (session) {
      return await signOut();
    }
    router.push("/signin");
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-2" : "px-5"
          )}
        >
          <Link href="/dashboard" aria-label="Votar dashboard" className="overflow-hidden">
            <img
              src={logo.src}
              alt="Votar"
              className={cn(
                "h-9 object-contain object-left",
                collapsed ? "w-9" : "w-auto"
              )}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main"
          className="sidebar-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = item.isActive(pathname);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <CollapsedTip collapsed={collapsed} label={item.label}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex h-10 items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                            collapsed ? "justify-center" : "px-3",
                            active
                              ? "bg-secondary text-primary"
                              : "text-slate-600 hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                          {collapsed ? (
                            <span className="sr-only">{item.label}</span>
                          ) : (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>
                      </CollapsedTip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Credits */}
        <div className="shrink-0 px-3 pb-3">
          {collapsed ? (
            <CollapsedTip
              collapsed
              label={`${isCreditLoading || !userId ? "…" : credit} Votar credits · Add credits`}
            >
              <button
                type="button"
                onClick={() => setShowAddCredits(true)}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-secondary text-primary transition-colors hover:bg-secondary/70"
                aria-label="Add Votar credits"
              >
                <Coins className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </CollapsedTip>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-[#015CE9] to-[#0146c7] p-4 text-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <Coins className="h-4 w-4" aria-hidden="true" />
                Votar credits
              </div>
              {isCreditLoading || !userId ? (
                <Skeleton className="mt-2 h-8 w-16 bg-white/25" />
              ) : (
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {credit}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowAddCredits(true)}
                className="mt-3 w-full rounded-md bg-white py-2 text-sm font-semibold text-[#015CE9] transition-colors hover:bg-blue-50"
              >
                Add credits
              </button>
            </div>
          )}
        </div>

        {/* Account */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-3 border-t border-border p-3",
            collapsed && "flex-col"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-semibold text-primary">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold capitalize text-foreground">
                {name || "Your account"}
              </p>
              {email && (
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              )}
            </div>
          )}
          <CollapsedTip collapsed={collapsed} label="Log out">
            <button
              type="button"
              onClick={() => setShowLogout(true)}
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-destructive"
            >
              <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </CollapsedTip>
        </div>
      </div>

      <AddCreditsDialog
        open={showAddCredits}
        onClose={() => setShowAddCredits(false)}
      />
      <ConfirmDialog
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        icon={LogOut}
        destructive
        title="Log out of Votar?"
        description="You'll need to sign in again to manage your elections."
        confirmLabel="Log out"
      />
    </TooltipProvider>
  );
};

export default SidebarContent;
