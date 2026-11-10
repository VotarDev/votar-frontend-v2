import React from "react";
import { cn } from "@/utils/cn";
import InfoTip from "./InfoTip";

interface FormFieldProps {
  label: string;
  /** id of the control, so clicking the label focuses it. */
  htmlFor?: string;
  /** Explanation shown in the "i" tooltip next to the label. */
  info?: React.ReactNode;
  /** Short always-visible note under the control (limits, formats). */
  hint?: React.ReactNode;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  htmlFor,
  info,
  hint,
  optional,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
      {info && <InfoTip label={`About ${label}`}>{info}</InfoTip>}
    </div>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export default FormField;
