import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import { cn } from "@/utils/cn";

interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  /** id of the dialog's heading, for screen readers. */
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A dialog panel on the shared backdrop, rendered on <body> so it covers the
 * whole screen (above the layout, fixed bars and the mobile menu).
 * Closes on the backdrop and on Escape.
 */
const DialogShell = ({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: DialogShellProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <div className="relative z-[1010]">
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="dialog" handleClose={onClose}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              className={cn(
                "w-full max-w-md rounded-lg bg-white p-6 text-left shadow-xl",
                className,
              )}
            >
              {children}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

export default DialogShell;
