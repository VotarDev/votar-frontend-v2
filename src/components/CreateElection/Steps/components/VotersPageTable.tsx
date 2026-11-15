import React, { useState } from "react";
import toast from "react-hot-toast";
import { Search, SearchX, Users, X } from "lucide-react";
import { VoterResponse } from "@/utils/types";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import EmptyState from "@/src/components/shared/EmptyState";
import { cn } from "@/utils/cn";
import ChangeLogModal from "./DropdownComponent";
import EditVotersInfo from "./EditVotersInfo";

interface VotersPageTableProps {
  electionId?: string | null;
  selectedRows: VoterResponse[];
  setSelectedRows: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
  handleResponseExported: (page?: number) => Promise<void>;
  responses: VoterResponse[];
  isFetchVoters: boolean;
  setResponses: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
  currentPage: number;
  itemsPerPage: number;
  onItemsPerPageChange: (newLimit: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const checkboxClass =
  "h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#015CE9]";

/** The email status pill; click it to see the reason. */
const StatusPill = ({ row }: { row: VoterResponse }) => {
  const status = row.email_status;
  const tone =
    status === "sent"
      ? "bg-emerald-50 text-emerald-700"
      : status === "pending"
        ? "bg-amber-50 text-amber-700"
        : status
          ? "bg-red-50 text-red-700"
          : "bg-muted text-muted-foreground";
  const label = status === "sent" ? "Email sent" : status ? status : "Not sent";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize transition-opacity hover:opacity-80",
            tone,
          )}
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 text-sm" align="end">
        <p className="font-semibold text-foreground">Email status</p>
        <p className="mt-1 text-muted-foreground">
          {row.email_reason || "No reason"}
        </p>
      </PopoverContent>
    </Popover>
  );
};

/** Voters for an election: search, select (by row, page or range) and edit. */
const VoterTable: React.FC<VotersPageTableProps> = ({
  selectedRows,
  setSelectedRows,
  handleResponseExported,
  responses,
  isFetchVoters,
  setResponses,
  currentPage,
  itemsPerPage,
  searchQuery,
  onSearchChange,
}) => {
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);

  const isSelected = (row: VoterResponse) =>
    selectedRows.some((selectedRow) => selectedRow.id === row.id);

  const handleCheckboxChange = (row: VoterResponse) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row],
    );
  };

  const allOnPageSelected =
    responses.length > 0 && responses.every((row) => isSelected(row));

  const toggleSelectPage = (checked: boolean) => {
    if (checked) {
      const newSelections = responses.filter((row) => !isSelected(row));
      setSelectedRows([...selectedRows, ...newSelections]);
    } else {
      const currentPageIds = responses.map((row) => row.id);
      setSelectedRows(
        selectedRows.filter((row) => !currentPageIds.includes(row.id)),
      );
    }
  };

  const handleRangeSelect = () => {
    if (
      rangeStart < 1 ||
      rangeEnd > responses.length ||
      rangeStart > rangeEnd
    ) {
      toast.error(
        "Invalid range. The start must be less than or equal to the end, and both within the voters on this page.",
      );
      return;
    }
    setSelectedRows(responses.slice(rangeStart - 1, rangeEnd));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const serial = (index: number) => {
    const n = startIndex + index + 1;
    return n < 10 ? `0${n}` : String(n);
  };

  const rowActions = (row: VoterResponse, index: number) => (
    <div className="flex items-center justify-end gap-1">
      <ChangeLogModal
        changeLogs={row.change_logs || []}
        voterId={row.id}
        currentVoter={row}
      />
      <EditVotersInfo
        users={responses}
        selectedRow={row}
        index={index}
        setUsers={setResponses}
        handleResponseExported={handleResponseExported}
      />
    </div>
  );

  const renderRows = () => {
    if (isFetchVoters) {
      return (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      );
    }

    if (responses.length === 0) {
      return searchQuery ? (
        <EmptyState
          icon={SearchX}
          title="No voters found"
          description={`No voters match "${searchQuery}".`}
        />
      ) : (
        <EmptyState
          icon={Users}
          title="No voters yet"
          description="Add voters to this election and they'll appear here."
        />
      );
    }

    return (
      <>
        {/* Phones: cards */}
        <ul className="divide-y divide-border md:hidden">
          {responses.map((row, index) => (
            <li key={row.id} className="flex gap-3 p-4">
              <input
                type="checkbox"
                className={cn(checkboxClass, "mt-1")}
                checked={isSelected(row)}
                onChange={() => handleCheckboxChange(row)}
                aria-label={`Select ${row.name}`}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {row.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{serial(index)} · ID {row.id}
                    </p>
                  </div>
                  <StatusPill row={row} />
                </div>
                {row.subgroup && (
                  <p className="text-sm text-muted-foreground">
                    {row.subgroup}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {row.phoneNumber}
                </p>
                <p className="break-all text-sm text-muted-foreground">
                  {row.email}
                </p>
                <div className="pt-1">{rowActions(row, index)}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* Wider screens: table */}
        <div className="hidden max-h-[700px] overflow-auto md:block">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-4 py-3">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-2 py-3">#</th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Sub-group</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {responses.map((row, index) => (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors hover:bg-muted/40",
                    isSelected(row) && "bg-secondary/40",
                  )}
                >
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={isSelected(row)}
                      onChange={() => handleCheckboxChange(row)}
                      aria-label={`Select ${row.name}`}
                    />
                  </td>
                  <td className="px-2 py-2.5 text-muted-foreground">
                    {serial(index)}
                  </td>
                  <td
                    className="max-w-[120px] truncate px-3 py-2.5"
                    title={String(row.id)}
                  >
                    {row.id}
                  </td>
                  <td
                    className="max-w-[180px] truncate px-3 py-2.5 font-medium text-foreground"
                    title={row.name}
                  >
                    {row.name}
                  </td>
                  <td
                    className="max-w-[140px] truncate px-3 py-2.5"
                    title={row.subgroup}
                  >
                    {row.subgroup}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {row.phoneNumber}
                  </td>
                  <td
                    className="max-w-[220px] truncate px-3 py-2.5"
                    title={row.email}
                  >
                    {row.email}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill row={row} />
                  </td>
                  <td className="px-4 py-2.5">{rowActions(row, index)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search by ID, name, sub-group, phone or email"
            aria-label="Search voters"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <label className="flex items-center gap-2 text-foreground">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={allOnPageSelected}
              onChange={(e) => toggleSelectPage(e.target.checked)}
              disabled={responses.length === 0}
            />
            Select page
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows</span>
            <input
              type="number"
              min={1}
              max={responses.length}
              value={rangeStart}
              onChange={(e) => setRangeStart(Number(e.target.value))}
              aria-label="Range start"
              className="h-8 w-16 rounded-md border border-input px-2 text-sm outline-none focus:border-primary"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="number"
              min={1}
              max={responses.length}
              value={rangeEnd}
              onChange={(e) => setRangeEnd(Number(e.target.value))}
              aria-label="Range end"
              className="h-8 w-16 rounded-md border border-input px-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleRangeSelect}
              disabled={responses.length === 0}
              className="h-8 rounded-md border border-input px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Select
            </button>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
            {selectedRows.length} selected
          </span>
        </div>
      </div>

      {renderRows()}
    </div>
  );
};

export default VoterTable;
