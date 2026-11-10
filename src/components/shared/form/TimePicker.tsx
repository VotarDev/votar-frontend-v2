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
  /** Show the field as having an error. */
  invalid?: boolean;
  /** Only times after this "HH:mm" can be picked (e.g. an end time on the start day). */
  after?: string;
  /** Only times before this "HH:mm" can be picked. */
  before?: string;
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

// Minutes since midnight, for comparing times.
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (total: number) =>
  `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;

/**
 * Hour, minute and AM/PM columns; any minute can be chosen, optionally only
 * within `after`/`before` (times outside are greyed out).
 */
const TimePicker = ({
  id,
  value,
  onChange,
  placeholder = "Pick a time",
  invalid,
  after,
  before,
}: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const parts = toParts(value);
  const current = parts ?? { hour: 9, minute: 0, period: "AM" as const };
  const listRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const afterMinutes = after ? toMinutes(after) : -1;
  const beforeMinutes = before ? toMinutes(before) : 24 * 60;
  // Whether any minute in [from, to] is allowed.
  const anyAllowed = (from: number, to: number) =>
    to > afterMinutes && from < beforeMinutes;

  // Picking an hour or AM/PM can land on a disallowed minute; move it to the
  // nearest allowed one instead.
  const select = (time: string) => {
    let total = toMinutes(time);
    if (total <= afterMinutes) total = afterMinutes + 1;
    if (total >= beforeMinutes) total = beforeMinutes - 1;
    if (total <= afterMinutes || total >= beforeMinutes) return;
    onChange(fromMinutes(total));
  };

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
    items: Array<{
      label: string;
      selected: boolean;
      disabled?: boolean;
      onSelect: () => void;
    }>,
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
          aria-disabled={item.disabled || undefined}
          data-selected={item.selected}
          disabled={item.disabled}
          onClick={item.onSelect}
          className={cn(
            "h-9 w-12 shrink-0 rounded-md text-sm transition-colors disabled:cursor-not-allowed disabled:text-slate-300 disabled:opacity-100 disabled:hover:bg-transparent",
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
            invalid && !open && "border-destructive",
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
            HOURS.map((hour) => {
              const start = toMinutes(fromParts(hour, 0, current.period));
              return {
                label: String(hour),
                selected: parts?.hour === hour,
                disabled: !anyAllowed(start, start + 59),
                onSelect: () =>
                  select(fromParts(hour, current.minute, current.period)),
              };
            }),
          )}
          {column(
            "Minute",
            MINUTES.map((minute) => {
              const total = toMinutes(
                fromParts(current.hour, minute, current.period),
              );
              return {
                label: pad(minute),
                selected: parts?.minute === minute,
                disabled: !anyAllowed(total, total),
                onSelect: () =>
                  select(fromParts(current.hour, minute, current.period)),
              };
            }),
          )}
          {column(
            "AM or PM",
            (["AM", "PM"] as const).map((period) => {
              const start = period === "AM" ? 0 : 12 * 60;
              return {
                label: period,
                selected: parts?.period === period,
                disabled: !anyAllowed(start, start + 12 * 60 - 1),
                onSelect: () =>
                  select(fromParts(current.hour, current.minute, period)),
              };
            }),
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
