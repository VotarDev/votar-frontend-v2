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
  /** Shown in red under the control; replaces the hint. */
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  htmlFor,
  info,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
      {info && <InfoTip label={`About ${label}`}>{info}</InfoTip>}
    </div>
    {children}
    {error ? (
      <p role="alert" className="text-xs font-medium text-destructive">
        {error}
      </p>
    ) : (
      hint && <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

export default FormField;
