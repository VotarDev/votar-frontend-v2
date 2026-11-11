import React, { useState } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

interface InfoTipProps {
  /** What the field is for, shown on hover, focus or tap. */
  children: React.ReactNode;
  label?: string;
}

/**
 * An "i" icon that explains a field. Opens on hover and keyboard focus, and on
 * tap so it also works on phones (tooltips don't open on touch by default).
 * Closes when the pointer leaves, on a tap elsewhere, or with Escape.
 */
const InfoTip = ({ children, label = "More information" }: InfoTipProps) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={() => setOpen(true)}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTip;
