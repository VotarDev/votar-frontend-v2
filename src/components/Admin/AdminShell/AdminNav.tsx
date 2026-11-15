import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  Archive,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ShieldCheck,
  Ticket,
  UserCog,
  Users,
  UsersRound,
  Vote,
  type LucideIcon,
} from "lucide-react";
import logo from "../../../../public/assets/logos/admin-logo.svg";
import { removeAdminData } from "@/redux/features/adminProfile/adminProfileSlice";
import type { RootState } from "@/redux/store";
import { clearAdminSession } from "@/utils/session";
import setAuthToken from "@/utils/setAuthToken";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const exact = (href: string) => (pathname: string) => pathname === href;
const within = (prefix: string) => (pathname: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

// Same destinations as the old top bar.
const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, isActive: exact("/admin") },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Elections", href: "/admin/elections", icon: Archive, isActive: within("/admin/elections") },
      {
        label: "Free · Pro · Meeting",
        href: "/admin/free-pro-meeting/pro",
        icon: Vote,
        isActive: within("/admin/free-pro-meeting"),
      },
      { label: "Users", href: "/admin/users", icon: Users, isActive: within("/admin/users") },
      { label: "Coupons", href: "/admin/coupon", icon: Ticket, isActive: within("/admin/coupon") },
      { label: "Referrals", href: "/admin/referals", icon: UsersRound, isActive: within("/admin/referals") },
      {
        label: "Blogs & FAQs",
        href: "/admin/blogs-and-faqs",
        icon: Newspaper,
        isActive: within("/admin/blogs-and-faqs"),
      },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Admin profile", href: "/admin/profile", icon: UserCog, isActive: within("/admin/profile") },
    ],
  },
];

/** Logo, navigation and account: the desktop sidebar and the mobile menu. */
const AdminNav = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const admin = useSelector((state: RootState) => state.admin.data) as
    | { username?: string }
    | undefined;
  // The admin's name comes from browser storage, which the server can't see:
  // show it only after mounting so both renders match (no hydration error).
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const username = (isMounted && admin?.username) || "Admin";

  const logout = () => {
    dispatch(removeAdminData());
    clearAdminSession();
    setAuthToken(null);
    router.push("/admin/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
        <Link href="/admin" aria-label="Admin dashboard">
          <img src={logo.src} alt="Votar" className="h-9 w-auto" />
        </Link>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
          Admin
        </span>
      </div>

      <nav aria-label="Admin" className="sidebar-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = item.isActive(router.pathname);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-secondary text-primary"
                          : "text-slate-600 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-t border-border px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold capitalize text-foreground">
            {username}
          </p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          aria-label="Log out"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        icon={LogOut}
        destructive
        title="Log out of the admin console?"
        description="You'll need to sign in again to manage Votar."
        confirmLabel="Log out"
      />
    </div>
  );
};

export default AdminNav;
