import React, { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/utils/cn";

interface TimePickerProps {
  id?: string;
  /** 24-hour "HH:mm", the same format a native time input uses. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = Array.from({ length: 60 }, (_, i) => i); // 0..59
const pad = (n: number) => String(n).padStart(2, "0");

const toParts = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours24 = Number(match[1]);
  return {
    hour: hours24 % 12 === 0 ? 12 : hours24 % 12,
    minute: Number(match[2]),
    period: hours24 < 12 ? "AM" : "PM",
  } as const;
};

const fromParts = (hour: number, minute: number, period: "AM" | "PM") => {
  const hours24 = (hour % 12) + (period === "PM" ? 12 : 0);
  return `${pad(hours24)}:${pad(minute)}`;
};

/** Hour, minute and AM/PM columns; any minute can be chosen. */
const TimePicker = ({
  id,
  value,
  onChange,
  placeholder = "Pick a time",
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const parts = toParts(value);
  const current = parts ?? { hour: 9, minute: 0, period: "AM" as const };
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Bring the selected values into view when the picker opens.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      Object.values(listRefs.current).forEach((list) => {
        list
          ?.querySelector<HTMLElement>("[data-selected=true]")
          ?.scrollIntoView({ block: "center" });
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [open]);

  const column = (
    key: string,
    items: Array<{ label: string; selected: boolean; onSelect: () => void }>,
  ) => (
    <div
      ref={(el) => {
        listRefs.current[key] = el;
      }}
      role="listbox"
      aria-label={key}
      className="flex max-h-56 flex-col gap-1 overflow-y-auto p-1"
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="option"
          aria-selected={item.selected}
          data-selected={item.selected}
          onClick={item.onSelect}
          className={cn(
            "h-9 w-12 shrink-0 rounded-md text-sm transition-colors",
            item.selected
              ? "bg-primary font-semibold text-primary-foreground"
              : "text-foreground hover:bg-muted",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm transition-colors hover:border-slate-300 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
            open && "border-primary ring-2 ring-ring/20",
          )}
        >
          <Clock
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className={parts ? "text-foreground" : "text-muted-foreground"}>
            {parts
              ? `${parts.hour}:${pad(parts.minute)} ${parts.period}`
              : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex divide-x divide-border">
          {column(
            "Hour",
            HOURS.map((hour) => ({
              label: String(hour),
              selected: parts?.hour === hour,
              onSelect: () =>
                onChange(fromParts(hour, current.minute, current.period)),
            })),
          )}
          {column(
            "Minute",
            MINUTES.map((minute) => ({
              label: pad(minute),
              selected: parts?.minute === minute,
              onSelect: () =>
                onChange(fromParts(current.hour, minute, current.period)),
            })),
          )}
          {column(
            "AM or PM",
            (["AM", "PM"] as const).map((period) => ({
              label: period,
              selected: parts?.period === period,
              onSelect: () =>
                onChange(fromParts(current.hour, current.minute, period)),
            })),
          )}
        </div>
        <div className="mt-2 flex justify-end border-t border-border pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-secondary"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
