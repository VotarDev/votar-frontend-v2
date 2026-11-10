import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import Modal from "../Modal";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<unknown>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: LucideIcon;
  /** Red confirm button, for actions like logging out or deleting. */
  destructive?: boolean;
}

/** "Are you sure?" dialog. Rendered on <body> so it covers the whole screen. */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon: Icon,
  destructive,
}: ConfirmDialogProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isWorking) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, isWorking, onClose]);

  const handleConfirm = async () => {
    setIsWorking(true);
    try {
      await onConfirm();
    } finally {
      setIsWorking(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="relative z-[1010]">
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="confirm" handleClose={() => !isWorking && onClose()}>
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-xl"
            >
              {Icon && (
                <span
                  className={cn(
                    "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
                    destructive ? "bg-red-50 text-destructive" : "bg-secondary text-primary"
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              )}
              <h2
                id="confirm-dialog-title"
                className="mt-4 text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isWorking}
                  autoFocus
                >
                  {cancelLabel}
                </Button>
                <Button
                  type="button"
                  variant={destructive ? "destructive" : "default"}
                  onClick={handleConfirm}
                  disabled={isWorking}
                >
                  {isWorking && <Loader2 className="animate-spin" />}
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
