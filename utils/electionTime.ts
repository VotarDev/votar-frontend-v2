/**
 * Election start/end times come back from the API as timezone-less strings,
 * e.g. "July 25, 2026 08:00" (older elections use "April 09, 2025,19:12:00",
 * and a few are epoch-millisecond strings like "1770901200000").
 *
 * Passing those strings to `new Date(str)` reads the digits in the *viewer's*
 * browser timezone, so the same election would open and close at a different
 * real-world moment for every voter (a voter in Tokyo would get in hours early,
 * one in New York hours late). Here we read the digits in ONE fixed timezone
 * instead, which turns them into an absolute instant that is identical for
 * every voter no matter where they are.
 *
 * Since March 2026 the create-election form converts the organiser's WAT input
 * to UTC before saving (Details.tsx -> formatDateTimeToUTC), so the digits are
 * UTC. If the stored digits ever become WAT (UTC+1) wall-clock time, set this
 * to 60; it is the only place that needs to change.
 */
export const ELECTION_TIME_UTC_OFFSET_MINUTES = 0;

export type ElectionStatus = "not_started" | "active" | "ended";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

// "July 25, 2026 08:00", "April 09, 2025,19:12:00", "October 1, 2025 09:30"
const FORMATTED_DATE =
  /^([A-Za-z]+)\.?\s+(\d{1,2}),?\s*(\d{4})(?:[\s,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * Turns a stored election date/time into an absolute point in time.
 * Returns null when the value can't be understood (e.g. "Invalid date").
 */
export const parseElectionDate = (value: unknown): Date | null => {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    const fromNumber = new Date(value);
    return isNaN(fromNumber.getTime()) ? null : fromNumber;
  }

  const text = String(value).trim();
  if (!text) return null;

  // Epoch milliseconds, e.g. "1770901200000"
  if (/^\d{12,13}$/.test(text)) {
    return new Date(Number(text));
  }

  const match = FORMATTED_DATE.exec(text);
  if (!match) return null;

  const [, monthName, day, year, hours = "0", minutes = "0", seconds = "0"] =
    match;
  const month = MONTHS.indexOf(monthName.slice(0, 3).toLowerCase());
  if (month === -1) return null;

  const y = Number(year);
  const d = Number(day);
  const h = Number(hours);
  const min = Number(minutes);
  const s = Number(seconds);

  const wallClock = new Date(Date.UTC(y, month, d, h, min, s));
  // Reject overflow such as "February 30" or "25:00".
  if (
    wallClock.getUTCFullYear() !== y ||
    wallClock.getUTCMonth() !== month ||
    wallClock.getUTCDate() !== d ||
    wallClock.getUTCHours() !== h ||
    wallClock.getUTCMinutes() !== min
  ) {
    return null;
  }

  return new Date(
    wallClock.getTime() - ELECTION_TIME_UTC_OFFSET_MINUTES * 60 * 1000
  );
};

/**
 * Whether voting is open at `now`. Both bounds are absolute instants, so the
 * answer is the same for a voter in Lagos, London or Tokyo.
 *
 * A missing/unreadable bound is ignored (the API still enforces the window).
 */
export const getElectionStatus = (
  start: Date | null,
  end: Date | null,
  now: number = Date.now()
): ElectionStatus => {
  if (start && now < start.getTime()) return "not_started";
  if (end && now > end.getTime()) return "ended";
  return "active";
};

/** The voter's own timezone, e.g. "America/New_York". */
export const getViewerTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

/** Formats an instant in the *viewer's* timezone, e.g. "Sat, July 25, 2026, 4:00 AM GMT-4". */
export const formatInViewerTimeZone = (date: Date): string =>
  date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
