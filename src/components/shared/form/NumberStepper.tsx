import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

interface NumberStepperProps {
  id?: string;
  value: number | string;
  onIncrement: () => void;
  onDecrement: () => void;
  /** When set, the value can also be typed. */
  onChange?: (value: string) => void;
  /** Disables the minus button (e.g. at the minimum). */
  atMinimum?: boolean;
  label: string;
  /** Show the control as having an error. */
  invalid?: boolean;
  className?: string;
}

const stepButton =
  "flex h-11 w-11 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

/** − value + control for whole-number settings. */
const NumberStepper = ({
  id,
  value,
  onIncrement,
  onDecrement,
  onChange,
  atMinimum,
  label,
  invalid,
  className,
}: NumberStepperProps) => (
  <div
    className={cn(
      "inline-flex h-11 items-stretch overflow-hidden rounded-md border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20",
      invalid && "border-destructive",
      className,
    )}
  >
    <button
      type="button"
      onClick={onDecrement}
      disabled={atMinimum}
      aria-label={`Decrease ${label}`}
      className={cn(stepButton, "border-r border-input")}
    >
      <Minus className="h-4 w-4" />
    </button>
    <input
      id={id}
      inputMode="numeric"
      value={value}
      readOnly={!onChange}
      onChange={(e) => onChange?.(e.target.value)}
      aria-label={label}
      aria-invalid={invalid || undefined}
      className="w-16 bg-transparent text-center text-sm font-semibold text-foreground outline-none"
    />
    <button
      type="button"
      onClick={onIncrement}
      aria-label={`Increase ${label}`}
      className={cn(stepButton, "border-l border-input")}
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

export default NumberStepper;
