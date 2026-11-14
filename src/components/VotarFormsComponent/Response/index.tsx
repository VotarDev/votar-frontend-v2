import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Cookies from "universal-cookie";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  FileSpreadsheet,
  Inbox,
  Loader2,
  Search,
  SearchX,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { VoterResponse } from "@/utils/types";
import { useCurrentUserId } from "@/utils/hooks";
import {
  deleteVoterResponse,
  exportVoters,
  getVoterResponse2,
  importFromCsv,
} from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { cn } from "@/utils/cn";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import EmptyState from "@/src/components/shared/EmptyState";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import ImportModal from "./ImportModal";

type ResponseData = {
  voters: VoterResponse[];
  election_id: string | null;
};

const ROW_HEIGHT = 53;
// Estimated height of a card on phones; real heights are measured.
const CARD_HEIGHT = 168;
const MOBILE_QUERY = "(max-width: 774px)";
const checkboxClass =
  "h-4 w-4 shrink-0 cursor-pointer rounded accent-[#015CE9] disabled:cursor-not-allowed disabled:opacity-40";

// A heading row such as "ID | Name | Sub-group | Phone | Email".
const isHeadingRow = ([id, name]: any[] = []) =>
  ["id", "voter id"].includes(String(id).trim().toLowerCase()) ||
  String(name).trim().toLowerCase() === "name";

const authorise = () => {
  const token = new Cookies().get("user-token");
  if (token) setAuthToken(token);
};

/** Responses to an election's Votar form: review, import, export and delete. */
const ResponseTable = () => {
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [electionID, setElectionID] = useState<string | null>("");
  const [votarResponses, setVotarResponses] = useState<VoterResponse[]>([]);
  const [isFetchResponse, setIsFetchResponse] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendingDelete, setPendingDelete] = useState<VoterResponse | null>(
    null,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Phones get cards instead of the wide table.
  const [isMobile, setIsMobile] = useState(false);
  const USER_ID = useCurrentUserId();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[0]);
  }, [id]);

  const handleCheckboxChange = (row: VoterResponse) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row],
    );
  };

  const getVoterResponses = async () => {
    if (!electionID) return;
    setIsFetchResponse(true);
    try {
      const { data } = await getVoterResponse2(electionID);

      if (data && data.data) {
        const fetchedResponses = data.data.voter_response;

        // First pass: map backend flags
        const mapped = fetchedResponses.map((item: any) => ({
          ...item,
          isDuplicate: item.duplicate || false,
          isExported: item.exported || false,
        }));

        // Second pass: client-side duplicate detection as safety net
        const seen = new Set<string>();
        const updatedData = mapped.map((item: VoterResponse) => {
          const key = `${item.id}_${String(item.name).toLowerCase().trim()}_${String(item.phoneNumber).trim()}_${String(item.email).toLowerCase().trim()}`;
          if (seen.has(key)) {
            return { ...item, isDuplicate: true };
          }
          seen.add(key);
          return item;
        });

        setVotarResponses(updatedData);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setIsFetchResponse(false);
    }
  };

  useEffect(() => {
    getVoterResponses();
  }, [electionID]);

  // Excel export leaves out duplicates, as before.
  const excelData = votarResponses
    ?.filter((item) => !item.isDuplicate)
    .map((obj) => {
      const { isDuplicate, ...newObj } = obj;
      return newObj;
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;
    authorise();
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) return;
        // Loaded only when importing, to keep the page light.
        const XLSX = await import("xlsx");
        const workBook = XLSX.read(e.target.result, { type: "binary" });
        const workSheet = workBook.Sheets[workBook.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(workSheet, {
          header: 1,
          raw: true,
          defval: "",
        });

        const newUserData = rows
          // Skip a heading row and completely empty rows.
          .filter((row, index) => !(index === 0 && isHeadingRow(row)))
          .filter((row) => row.some((cell) => String(cell).trim() !== ""))
          .map(([id, name, subgroup, phoneNumber, email]: any) => ({
            id: String(id).trim(),
            name: String(name).trim(),
            subgroup,
            phoneNumber: String(phoneNumber).trim(),
            email: String(email).trim(),
          }));

        if (newUserData.length === 0) {
          toast.error("No new unique voters found in file");
          return;
        }

        await importFromCsv(USER_ID as string, {
          electionId: electionID,
          voters: newUserData,
        });

        await getVoterResponses();
        toast.success("Imported All Voters (Duplicates Flagged)");
        setShowImport(false);
        setSelectedFile(null);
      } catch (err) {
        console.log(err);
        toast.error("Import failed");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const exportResponseToElection = async (): Promise<void> => {
    const votersToProcess =
      selectedRows.length > 0 ? selectedRows : votarResponses;

    const uniqueItems: VoterResponse[] = votersToProcess.filter(
      (item) => !item.isExported && !item.isDuplicate,
    );

    if (uniqueItems.length === 0) {
      toast.error(
        selectedRows.length > 0
          ? "Selected voters are already exported"
          : "No new voters to export",
      );
      return;
    }

    setIsExporting(true);
    authorise();

    // Only new, non-duplicate responses go to the election: duplicates and
    // responses already exported stay out.
    const responseData: ResponseData = {
      voters: uniqueItems,
      election_id: electionID,
    };

    try {
      const { data } = await exportVoters(responseData, USER_ID as string);
      if (data) {
        toast.success(
          `${uniqueItems.length} Response(s) exported successfully`,
        );
        setSelectedRows([]);
        getVoterResponses();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Export failed",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const { data } = await deleteVoterResponse({
        voter_id: pendingDelete.id,
        email: pendingDelete.email,
        election_id: electionID,
      } as any);
      if (data) {
        toast.success("Deleted");
        getVoterResponses();
      }
    } catch (e: any) {
      console.log(e);
      toast.error(
        e?.response?.data?.message || "Couldn't delete this response",
      );
    } finally {
      setPendingDelete(null);
    }
  };

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return votarResponses;
    return votarResponses.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phoneNumber?.toLowerCase().includes(q) ||
        r.id?.toLowerCase().includes(q) ||
        r.subgroup?.toLowerCase().includes(q),
    );
  }, [searchQuery, votarResponses]);

  const counts = useMemo(
    () => ({
      duplicates: votarResponses.filter((r) => r.isDuplicate).length,
      // Same rule as the status column (and the export toast): a duplicate
      // counts as a duplicate, even if the server also flags it exported.
      exported: votarResponses.filter((r) => r.isExported && !r.isDuplicate)
        .length,
    }),
    [votarResponses],
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Only the visible rows (or cards) are rendered, so long lists stay fast.
  const rowVirtualizer = useVirtualizer({
    count: filteredRows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => (isMobile ? CARD_HEIGHT : ROW_HEIGHT),
    overscan: isMobile ? 4 : 10,
  });

  // Re-measure when switching between cards and table rows.
  useEffect(() => {
    rowVirtualizer.measure();
  }, [isMobile]);

  const isSelected = (row: VoterResponse) =>
    selectedRows.some((selectedRow) => selectedRow.id === row.id);

  const statusBadge = (row: VoterResponse) =>
    row.isDuplicate ? (
      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        Duplicate
      </span>
    ) : row.isExported ? (
      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        Exported
      </span>
    ) : (
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        New
      </span>
    );
  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - virtualItems[virtualItems.length - 1].end
      : 0;

  const stats = [
    { label: "Responses", value: votarResponses.length },
    { label: "Duplicates", value: counts.duplicates, tone: "text-red-600" },
    { label: "Exported", value: counts.exported, tone: "text-emerald-600" },
    { label: "Selected", value: selectedRows.length, tone: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold text-foreground",
                stat.tone,
              )}
            >
              {isFetchResponse && !votarResponses.length
                ? "—"
                : stat.value.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by name, email, phone, ID or sub-group"
              aria-label="Search responses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowImport(true)}>
              <Upload /> Import
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                // Loaded only when exporting, to keep the page light.
                const { downloadExcel } = await import("@/utils/exportExcel");
                downloadExcel(excelData, "Excel Export");
              }}
              disabled={excelData.length === 0}
            >
              <FileSpreadsheet /> Export to Excel
            </Button>
            <Button onClick={exportResponseToElection} disabled={isExporting}>
              {isExporting ? <Loader2 className="animate-spin" /> : <Send />}
              {selectedRows.length > 0
                ? `Export selected (${selectedRows.length})`
                : "Export all to election"}
            </Button>
          </div>
        </div>

        {/* Rows */}
        {isFetchResponse && !votarResponses.length ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : votarResponses.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No responses yet"
            description="Share the form's link with voters, or import a spreadsheet."
          />
        ) : filteredRows.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No responses found"
            description={`Nothing matches "${searchQuery}".`}
          />
        ) : isMobile ? (
          <div ref={scrollContainerRef} className="max-h-[70vh] overflow-auto">
            <div className="relative w-full" style={{ height: totalSize }}>
              {virtualItems.map((virtualRow) => {
                const row = filteredRows[virtualRow.index];
                const index = virtualRow.index;
                const locked = row.isDuplicate || row.isExported;
                return (
                  <div
                    key={`${row.id ?? "row"}-${index}`}
                    data-index={index}
                    ref={rowVirtualizer.measureElement}
                    className={cn(
                      "absolute left-0 top-0 flex w-full gap-3 border-b border-border p-4",
                      row.isDuplicate && "bg-red-50/70",
                      row.isExported && "text-muted-foreground",
                      isSelected(row) && "bg-secondary/40",
                    )}
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <input
                      type="checkbox"
                      className={cn(checkboxClass, "mt-1")}
                      disabled={locked}
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
                            #{index < 9 ? `0${index + 1}` : index + 1} · ID{" "}
                            {row.id}
                          </p>
                        </div>
                        {statusBadge(row)}
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
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={row.isExported}
                      onClick={() => setPendingDelete(row)}
                      aria-label={`Delete ${row.name}`}
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div ref={scrollContainerRef} className="max-h-[640px] overflow-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur">
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
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paddingTop > 0 && (
                  <tr style={{ height: paddingTop }}>
                    <td colSpan={9} className="p-0" />
                  </tr>
                )}
                {virtualItems.map((virtualRow) => {
                  const row = filteredRows[virtualRow.index];
                  const index = virtualRow.index;
                  const locked = row.isDuplicate || row.isExported;
                  const selected = selectedRows.some(
                    (selectedRow) => selectedRow.id === row.id,
                  );
                  return (
                    <tr
                      key={`${row.id ?? "row"}-${index}`}
                      style={{ height: ROW_HEIGHT }}
                      className={cn(
                        "transition-colors",
                        row.isDuplicate && "bg-red-50/70",
                        row.isExported && "text-muted-foreground",
                        selected && "bg-secondary/40",
                        !locked && "hover:bg-muted/40",
                      )}
                    >
                      <td className="px-4">
                        <input
                          type="checkbox"
                          className={checkboxClass}
                          disabled={locked}
                          checked={selected}
                          onChange={() => handleCheckboxChange(row)}
                          aria-label={`Select ${row.name}`}
                        />
                      </td>
                      <td className="px-2 text-muted-foreground">
                        {index < 9 ? `0${index + 1}` : index + 1}
                      </td>
                      <td
                        className="max-w-[120px] truncate px-3"
                        title={String(row.id)}
                      >
                        {row.id}
                      </td>
                      <td
                        className="max-w-[180px] truncate px-3 font-medium"
                        title={row.name}
                      >
                        {row.name}
                      </td>
                      <td
                        className="max-w-[140px] truncate px-3"
                        title={row.subgroup}
                      >
                        {row.subgroup}
                      </td>
                      <td className="whitespace-nowrap px-3">
                        {row.phoneNumber}
                      </td>
                      <td
                        className="max-w-[220px] truncate px-3"
                        title={row.email}
                      >
                        {row.email}
                      </td>
                      <td className="px-3">
                        {row.isDuplicate ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                            Duplicate
                          </span>
                        ) : row.isExported ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Exported
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            New
                          </span>
                        )}
                      </td>
                      <td className="px-4 text-right">
                        {/* Exported rows were locked before, delete included. */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={row.isExported}
                          onClick={() => setPendingDelete(row)}
                          aria-label={`Delete ${row.name}`}
                          className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr style={{ height: paddingBottom }}>
                    <td colSpan={9} className="p-0" />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {votarResponses.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            Showing {filteredRows.length.toLocaleString()} of{" "}
            {votarResponses.length.toLocaleString()} responses
          </div>
        )}
      </Card>

      <ImportModal
        open={showImport}
        handleClose={() => setShowImport(false)}
        handleFileUpload={handleFileUpload}
        handleFileChange={handleFileChange}
        selectedFile={selectedFile}
        isImporting={isImporting}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        icon={Trash2}
        destructive
        title={`Delete "${pendingDelete?.name || "this response"}"?`}
        description="This will permanently remove the details from the system and cannot be reversed."
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ResponseTable;
