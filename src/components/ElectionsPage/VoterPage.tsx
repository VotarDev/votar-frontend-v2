import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
} from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import { VoterResponse } from "@/utils/types";
import { getElectionById, getVoters, sendVoterCred } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import VoterTable from "./VoterTable";
import Cookies from "universal-cookie";

const VoterPage = () => {
  const [preference, setPreference] = useState("");
  const [text, setText] = useState("");
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [responses, setResponses] = useState<VoterResponse[]>([]);
  const [isFetchVoters, setIsFetchVoters] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const router = useRouter();
  const maxCharacterLength = 100;
  const users = useCurrentUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [electionID, setElectionID] = useState("");
  const [error, setError] = useState("");
  const url = router.asPath;
  const cookies = new Cookies();

  const extractedText = url.split("/").slice(-2).join("/");

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const handlePreference = (e: ChangeEvent<HTMLInputElement>) => {
    setPreference(e.target.value);
  };

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterLength) setText(inputValue);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown> | null,
    value: number
  ) => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }

      try {
        if (electionID) {
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            setIsLoading(false);
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message);
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  const handleResponseExported = useCallback(
    async (page?: number) => {
      const pageToFetch = page || currentPage;
      setResponses([]);
      setIsFetchVoters(true);

      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }

      try {
        if (electionID) {
          const { data } = await getVoters(
            USER_ID,
            {
              election_id: electionID,
            },
            pageToFetch.toString(),
            itemsPerPage.toString(),
            debouncedSearchQuery.trim() || undefined
          );

          if (data) {
            const votersArray = Array.isArray(data.data?.voters)
              ? data.data.voters
              : Array.isArray(data.data)
              ? data.data
              : [];

            setResponses(votersArray);

            if (data.data) {
              const currentPageFromBackend = data.data.page || pageToFetch;
              const limitFromBackend = data.data.limit || itemsPerPage;
              const votersCount = votersArray.length;

              if (votersCount < limitFromBackend) {
                setTotalPages(currentPageFromBackend);
                setTotalItems(
                  (currentPageFromBackend - 1) * limitFromBackend + votersCount
                );
              } else {
                setTotalPages(currentPageFromBackend + 1);
                setTotalItems(currentPageFromBackend * limitFromBackend);
              }
            } else {
              const hasMore = votersArray.length === itemsPerPage;
              setTotalPages(hasMore ? currentPage + 1 : currentPage);
              setTotalItems(
                hasMore
                  ? currentPage * itemsPerPage
                  : (currentPage - 1) * itemsPerPage + votersArray.length
              );
            }

            setIsFetchVoters(false);
          }
        }
      } catch (e) {
        console.log("Error fetching voters:", e);
        setIsFetchVoters(false);
      }
    },
    [USER_ID, electionID, currentPage, itemsPerPage, debouncedSearchQuery]
  );

  useEffect(() => {
    if (electionID && USER_ID) {
      handleResponseExported();
    }
  }, [currentPage, itemsPerPage, electionID, USER_ID, debouncedSearchQuery]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      if (typeof window !== "undefined") {
        const credentialsData = {
          election_id: electionID,
          preferences: preference,
          message: text,
          voters: credentials,
        };
        const { data } = await sendVoterCred(credentialsData, USER_ID);
        handleResponseExported(currentPage);
        setIsSending(false);
        toast.success("Voters have been successfully sent");
      }
    } catch (error) {
      handleResponseExported(currentPage);
      setIsSending(false);
      toast.error("An error occurred. Please try again");
    }
  };

  const handleRouting = () => {
    router.push(`/votar-forms/${extractedText}`);
  };

  return (
    <div className="my-[60px]">
      <div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <div className="pb-3">
              <label htmlFor="notification" className="text-2xl font-semibold">
                Election Notification
              </label>
            </div>

            <textarea
              onChange={handleTextArea}
              value={text}
              maxLength={maxCharacterLength}
              name="notification"
              id="notification"
              className="w-full h-80 rounded-lg border border-stone-900 resize-none outline-none p-4"
            ></textarea>
          </div>
          <div className="flex justify-between pb-2 flex-wrap gap-1">
            <div className="flex items-center gap-7">
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="email"
                        checked={preference === "email"}
                        onChange={handlePreference}
                        inputProps={{ "aria-label": "controlled" }}
                        disableRipple
                        sx={{
                          color: "#848484",
                          "&.Mui-checked": {
                            color: "#015CE9",
                          },
                        }}
                      />
                    }
                    label="Via Email"
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="sms"
                        checked={preference === "sms"}
                        onChange={handlePreference}
                        inputProps={{ "aria-label": "controlled" }}
                        disableRipple
                        sx={{
                          color: "#848484",
                          "&.Mui-checked": {
                            color: "#015CE9",
                          },
                        }}
                      />
                    }
                    label="Via SMS"
                  />
                </FormGroup>
              </div>
            </div>
            <div className="text-base">
              {text.length} / {maxCharacterLength} Words ({maxCharacterLength}{" "}
              per Page)
            </div>
          </div>
          <div className="flex justify-center lg:my-0 my-5">
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <button
                disabled={!election.published ? true : false}
                className="w-32 h-12 flex items-center justify-center bg-blue-700 rounded-lg outline-none text-zinc-100 text-lg font-semibold"
              >
                Send
                {isSending && (
                  <CircularProgress
                    size={20}
                    style={{ color: "#fff" }}
                    className="ml-2"
                  />
                )}
              </button>
            )}
          </div>
        </form>
        <div className="flex lg:justify-end justify-center mt-10 lg:mt-3">
          <button
            className="flex justify-center items-center bg-blue-700 text-zinc-100 w-56 h-12 rounded-lg"
            onClick={handleRouting}
          >
            Add voters for your election
          </button>
        </div>
      </div>

      <VoterTable
        electionId={electionID}
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
        <div className="flex justify-between items-center lg:px-6 flex-wrap gap-2 mt-5">
          <div>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} - Showing {responses.length} voters
              {responses.length === itemsPerPage && " (more pages available)"}
              {debouncedSearchQuery &&
                ` (filtered by: "${debouncedSearchQuery}")`}
            </Typography>
          </div>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "1rem",
                },
              }}
            />
          )}
          <div className="flex items-center gap-2">
            <Typography variant="body2">Items per page:</Typography>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>
      )}

      {responses.length === 0 && !isFetchVoters && debouncedSearchQuery && (
        <div className="text-center py-8 text-gray-500">
          No voters found matching "{debouncedSearchQuery}"
        </div>
      )}
    </div>
  );
};

export default VoterPage;
