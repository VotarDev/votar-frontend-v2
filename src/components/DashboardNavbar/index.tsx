import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import SidebarContent from "../SideBar/SidebarContent";
import { cn } from "@/utils/cn";

/** Mobile top bar with a slide-in menu showing the same content as the desktop sidebar. */
const DashboardNavbar = () => {
  const [isOpen, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // While the menu is open, stop the page behind it from scrolling by locking
  // every scrollable ancestor (and the body).
  useEffect(() => {
    if (!isOpen) return;

    const locked: { el: HTMLElement; overflow: string }[] = [];
    let el = navRef.current?.parentElement ?? null;
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (
        el === document.body ||
        el === document.documentElement ||
        overflowY === "auto" ||
        overflowY === "scroll"
      ) {
        locked.push({ el, overflow: el.style.overflow });
        el.style.overflow = "hidden";
      }
      el = el.parentElement;
    }

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // The mobile navbar is hidden from lg up, so close the menu if the screen widens.
    const desktop = window.matchMedia("(min-width: 998px)");
    const closeOnDesktop = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      locked.forEach(({ el, overflow }) => (el.style.overflow = overflow));
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={navRef}
        className="flex h-14 items-center justify-between border-b border-border bg-white px-4"
      >
        <Link href="/dashboard" aria-label="Votar dashboard">
          <img src={logo.src} alt="Votar" className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-muted"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[998] bg-black/50 transition-opacity duration-200 ease-in-out",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed bottom-0 left-0 top-0 z-[999] w-[280px] max-w-[85vw] overscroll-contain bg-white shadow-xl transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-3 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </div>
    </>
  );
};

export default DashboardNavbar;
