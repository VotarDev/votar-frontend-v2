import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, Vote } from "lucide-react";
import { cn } from "@/utils/cn";

// Same destinations as before.
const OPTIONS = [
  {
    href: "/signin",
    label: "Sign In to Dashboard",
    description: "Create and manage your elections",
    icon: LayoutDashboard,
  },
  {
    href: "/vote",
    label: "Sign In to Vote",
    description: "Use your voting details to cast a vote",
    icon: Vote,
  },
];

interface SignInMenuProps {
  /** Classes for the trigger button (keeps each navbar's own button style). */
  buttonClassName: string;
  /** Also open on hover (desktop). */
  openOnHover?: boolean;
  align?: "left" | "right";
}

/**
 * The navbar's Sign In button and its menu. Opens on click/tap (and hover on
 * desktop); closes on outside click, Escape, or choosing an option.
 */
const SignInMenu = ({ buttonClassName, openOnHover, align = "left" }: SignInMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // A short grace period so moving the pointer onto the menu doesn't close it.
  const hoverProps = openOnHover
    ? {
        onMouseEnter: () => {
          window.clearTimeout(closeTimer.current);
          setOpen(true);
        },
        onMouseLeave: () => {
          closeTimer.current = window.setTimeout(() => setOpen(false), 150);
        },
      }
    : {};

  return (
    <div ref={rootRef} className="relative" {...hoverProps}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn("flex items-center justify-center gap-1.5", buttonClassName)}
      >
        Sign In
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              // pt-2 bridges the gap under the button so hover isn't lost.
              "absolute top-full z-[1000] pt-2",
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            <div className="w-72 rounded-xl border border-slate-100 bg-white p-2 text-left shadow-xl">
              {OPTIONS.map(({ href, label, description, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[#015CE9]/5 focus-visible:bg-[#015CE9]/5 focus-visible:outline-none"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#015CE9]/10 text-[#015CE9] transition-colors group-hover:bg-[#015CE9] group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-[#015CE9]">{label}</span>
                    <span className="block text-sm text-slate-500">{description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignInMenu;
