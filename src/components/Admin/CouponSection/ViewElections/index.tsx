import React, { useState } from "react";
import { Search, X } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";

export interface Coupon {
  id: number;
  couponName: string;
  couponCodeCriteria: string;
  couponAccess: string;
  active: boolean;
}

// Sample rows (there's no coupon API yet).
const SAMPLE_ELECTIONS = [
  { id: 1, election: "National economics election", actualAmount: 20000, discountedAmount: 10000 },
  { id: 2, election: "Biology election", actualAmount: 15000, discountedAmount: 7500 },
  { id: 3, election: "Mechanical election", actualAmount: 12000, discountedAmount: 6000 },
];

const naira = (value: number) => `₦${value.toLocaleString()}`;

/** Elections a coupon was used on (sample data until coupons have an API). */
const ViewElections = ({
  coupon,
  onClose,
}: {
  coupon: Coupon | null;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState("");
  const rows = SAMPLE_ELECTIONS.filter((row) =>
    row.election.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <DialogShell
      open={!!coupon}
      onClose={onClose}
      labelledBy="coupon-elections-title"
      className="flex max-h-[85vh] max-w-xl flex-col overflow-hidden p-0"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 id="coupon-elections-title" className="font-semibold text-foreground">
            Elections using {coupon?.couponName}
          </h2>
          <p className="text-xs text-muted-foreground">Sample data. Not connected yet.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search elections"
            aria-label="Search elections"
            className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {rows.length === 0 ? (
          <li className="p-6 text-center text-sm text-muted-foreground">No elections match.</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="min-w-0 truncate font-medium text-foreground">{row.election}</span>
              <span className="shrink-0 text-right text-sm">
                <span className="block font-semibold text-foreground">{naira(row.discountedAmount)}</span>
                <span className="block text-xs text-muted-foreground line-through">
                  {naira(row.actualAmount)}
                </span>
              </span>
            </li>
          ))
        )}
      </ul>
    </DialogShell>
  );
};

export default ViewElections;
