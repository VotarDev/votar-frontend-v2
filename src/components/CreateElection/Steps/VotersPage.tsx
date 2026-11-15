import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import {
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  UserPlus,
} from "lucide-react";
import VotersPageTable from "./components/VotersPageTable";
import { VoterResponse } from "@/utils/types";
import { getElectionById, getVoters, sendVoterCred } from "@/utils/api";
import { useCurrentUserId } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import Pagination from "@/src/components/shared/Pagination";
import InfoTip from "@/src/components/shared/form/InfoTip";
import { cn } from "@/utils/cn";

const MAX_MESSAGE_LENGTH = 100;
const PAGE_SIZES = [50, 100, 200, 500];

interface VotersPageProps {
  /** The election; the create flow passes none and uses its saved draft. */
  electionId?: string;
}

/**
 * Voters for an election: add them, send their voting credentials, and
 * manage the list. Used by both the create and the edit election flows.
 */
const VotersPage = ({ electionId: electionIdProp }: VotersPageProps) => {
  const [preference, setPreference] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [responses, setResponses] = useState<VoterResponse[]>([]);
  const [isFetchVoters, setIsFetchVoters] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [election, setElection] = useState<any>({});
  const [electionId, setElectionId] = useState<string | null>(
    electionIdProp || null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const router = useRouter();
  const USER_ID = useCurrentUserId();
  const cookies = new Cookies();

  const isPublished = !!election?.published;
  const smsAllowed = !!election?.notification_options?.includes("sms");

  // The edit page passes the election; the create flow uses its saved draft.
  useEffect(() => {
    setElectionId(electionIdProp || localStorage.getItem("ElectionId"));
  }, [electionIdProp]);

  const handlePreference = (value: string) => {
    if (!isPublished) return;

    if (value === "sms" && !smsAllowed) {
      toast.error("Admin has not yet granted permission for this feature");
      return;
    }

    setPreference((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_MESSAGE_LENGTH) setText(inputValue);
  };

  const handlePageChange = (value: number) => {
    setCurrentPage(value);
    setSelectedRows([]);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResponseExported = useCallback(
    async (page?: number) => {
      const pageToFetch = page || currentPage;
      if (!electionId) return;
      setResponses([]);
      setIsFetchVoters(true);
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }

      try {
        const { data } = await getVoters(
          USER_ID as string,
          { election_id: electionId },
          pageToFetch.toString(),
          itemsPerPage.toString(),
          debouncedSearchQuery.trim() || undefined,
        );

        if (data) {
          const votersArray = Array.isArray(data.data?.voters)
            ? data.data.voters
            : Array.isArray(data.data)
              ? data.data
              : [];

          // The API doesn't guarantee a stable order, so the same page can
          // come back reshuffled between requests. Sort by ID here so the
          // table shows the same order every time you land on a page.
          const sortedVotersArray = [...votersArray].sort(
            (a: VoterResponse, b: VoterResponse) =>
              String(a.id ?? "").localeCompare(String(b.id ?? ""), undefined, {
                numeric: true,
                sensitivity: "base",
              }),
          );

          setResponses(sortedVotersArray);

          // The API doesn't return a total, so there's another page whenever
          // this one came back full.
          if (data.data) {
            const currentPageFromBackend = data.data.page || pageToFetch;
            const limitFromBackend = data.data.limit || itemsPerPage;
            setTotalPages(
              votersArray.length < limitFromBackend
                ? currentPageFromBackend
                : currentPageFromBackend + 1,
            );
          } else {
            const hasMore = votersArray.length === itemsPerPage;
            setTotalPages(hasMore ? currentPage + 1 : currentPage);
          }
        }
      } catch (e) {
        console.log("Error fetching voters:", e);
      } finally {
        setIsFetchVoters(false);
      }
    },
    [USER_ID, electionId, currentPage, itemsPerPage, debouncedSearchQuery],
  );

  useEffect(() => {
    if (electionId && USER_ID) {
      handleResponseExported();
    }
  }, [currentPage, itemsPerPage, electionId, USER_ID, debouncedSearchQuery]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (preference.length === 0) {
      toast.error(
        "Please select at least one notification option (Email or SMS) before sending.",
      );
      return;
    }

    setIsSending(true);
    const token = cookies.get("user-token");
    if (token) {
      setAuthToken(token);
    }

    const credentials = selectedRows.map((row) => ({
      email: row.email,
      phoneNumber: row.phoneNumber,
      id: row.id,
      sub_group: row.subgroup,
      name: row.name,
    }));

    try {
      const credentialsData = {
        election_id: electionId,
        preferences: preference,
        message: text,
        voters: credentials,
      };
      const { data } = await sendVoterCred(credentialsData, USER_ID as string);
      if (data) {
        handleResponseExported(currentPage);
        toast.success("Voters Credentials sent successfully");
      }
    } catch (e: any) {
      handleResponseExported(currentPage);
      toast.error("An error occurred, please try again");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const getElection = async () => {
      if (!electionId) return;
      setIsLoading(true);
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }

      try {
        const { data } = await getElectionById({ election_id: electionId });
        if (data) setElection(data.data);
      } catch (e: any) {
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionId]);

  const handleRouting = () => {
    router.push(`/votar-forms/${election?.name_of_election}/${electionId}`);
  };

  const channel = (
    value: "email" | "sms",
    label: string,
    Icon: React.ElementType,
    blocked: boolean,
  ) => {
    const checked = preference.includes(value);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => handlePreference(value)}
        disabled={!isPublished}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "border-primary bg-secondary text-primary"
            : "border-input bg-white text-foreground hover:bg-muted",
          blocked && "text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
        {blocked && (
          <span className="rounded bg-muted px-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
            Needs approval
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {!isLoading && !isPublished && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Sending credentials becomes available once an admin publishes this
          election.
        </div>
      )}

      <Card className="flex flex-col gap-4 p-5 smm:flex-row smm:items-center smm:justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Add voters</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Collect voter details with a Votar form, then send them their
            credentials below.
          </p>
        </div>
        <Button onClick={handleRouting} className="shrink-0">
          <UserPlus /> Add voters
        </Button>
      </Card>

      <Card className="p-5">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="notification"
                className="font-semibold text-foreground"
              >
                Send voting credentials
              </label>
              <InfoTip label="About sending credentials">
                Select voters in the list below, add an optional message, and
                choose how to send their credentials.
              </InfoTip>
            </div>
            <Textarea
              id="notification"
              name="notification"
              onChange={handleTextArea}
              value={text}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Add a short message for your voters (optional)"
              className="mt-3 min-h-[96px] resize-none"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {text.length}/{MAX_MESSAGE_LENGTH} characters
            </p>
          </div>

          <div className="flex flex-col gap-4 smm:flex-row smm:items-center smm:justify-between">
            <div className="flex flex-wrap gap-2">
              {channel("email", "Email", Mail, false)}
              {channel("sms", "SMS", MessageSquare, isPublished && !smsAllowed)}
            </div>
            <Button
              type="submit"
              disabled={!isPublished || isSending || isLoading}
              className="shrink-0"
            >
              {isSending ? <Loader2 className="animate-spin" /> : <Send />}
              Send to {selectedRows.length}{" "}
              {selectedRows.length === 1 ? "voter" : "voters"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <VotersPageTable
          electionId={electionId}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleResponseExported={handleResponseExported}
          responses={responses}
          isFetchVoters={isFetchVoters}
          setResponses={setResponses}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {responses.length > 0 && (
          <div className="flex flex-col items-center gap-3 border-t border-border p-4 md:flex-row md:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} · {responses.length} voters
              {responses.length === itemsPerPage && " (more on the next page)"}
            </p>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Per page
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="h-9 rounded-md border border-input bg-white px-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VotersPage;
