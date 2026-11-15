import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { Menu, X } from "lucide-react";
import logo from "../../../../public/assets/logos/admin-logo.svg";
import AdminNav from "../AdminShell/AdminNav";
import { SCROLL_CONTAINER_PROPS, scrollToTop } from "@/utils/scrollToTop";
import { cn } from "@/utils/cn";

/**
 * Admin shell: sidebar on desktop, a top bar with a slide-in menu on phones,
 * and one scrolling content area. The middleware already keeps signed-out
 * visitors out; the check here covers a token removed while the tab is open.
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!new Cookies().get("admin-token")) router.push("/admin/login");
  }, [router.pathname]);

  // New page: close the menu and start at the top.
  useEffect(() => {
    const onRoute = () => {
      setMenuOpen(false);
      scrollToTop();
    };
    router.events.on("routeChangeComplete", onRoute);
    return () => router.events.off("routeChangeComplete", onRoute);
  }, [router.events]);

  // While the menu is open: no background scroll, Escape closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden w-[264px] shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
        <AdminNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 lg:hidden"
        >
          <Link href="/admin" aria-label="Admin dashboard" className="flex items-center gap-2">
            <img src={logo.src} alt="Votar" className="h-8 w-auto" />
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main
          {...SCROLL_CONTAINER_PROPS}
          className="relative flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>

      {/* Mobile menu */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[998] bg-black/50 transition-opacity duration-200 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu"
        className={cn(
          "fixed bottom-0 left-0 top-0 z-[999] w-[280px] max-w-[85vw] overscroll-contain bg-white shadow-xl transition-transform duration-200 lg:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
        <AdminNav />
      </div>
    </div>
  );
};

export default AdminLayout;
