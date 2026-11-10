import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/utils/cn";

/** "2026-11-05" -> local Date (no timezone shift, unlike new Date(string)). */
export const parseDateValue = (value?: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

interface DatePickerProps {
  id?: string;
  /** "YYYY-MM-DD", the same format a native date input uses. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Show the field as having an error. */
  invalid?: boolean;
  /** Days that can't be picked. */
  disabled?: Matcher | Matcher[];
}

const DatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  invalid,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = parseDateValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm transition-colors hover:border-slate-300 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
            open && "border-primary ring-2 ring-ring/20",
            invalid && !open && "border-destructive",
          )}
        >
          <CalendarDays
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span
            className={cn(
              "truncate",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selected ? format(selected, "EEE, d MMM yyyy") : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          disabled={disabled}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
