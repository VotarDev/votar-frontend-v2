import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import VotersPageTable from "../CreateElection/Steps/components/VotersPageTable";
import { VoterResponse } from "@/utils/types";
import { getElectionById, sendVoterCred } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import VoterTable from "./VoterTable";

const VoterPage = () => {
  const [preference, setPreference] = useState("");
  const [text, setText] = useState("");
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const maxCharacterLength = 100;
  const users = useCurrentUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [electionID, setElectionID] = useState("");
  const [error, setError] = useState("");
  const url = "/elections/Best%20in%20Fooling/ELE5157D6EC";
  const extractedText = url.split("/").slice(-2).join("/");
  console.log(extractedText);

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

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);
  console.log(electionID);

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else {
      if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }
    }
    const credentials = selectedRows.map((row) => ({
      email: row.email,
      phoneNumber: row.phoneNumber,
      id: row.id,
      sub_group: row.subgroup,
      name: row.name,
    }));
    console.log(credentials);
    try {
      if (typeof window !== "undefined") {
        const electionId = localStorage.getItem("ElectionId");
        const credentialsData = {
          election_id: electionID,
          preferences: preference,
          message: text,
          voters: credentials,
        };
        const { data } = await sendVoterCred(credentialsData, USER_ID);
        console.log(data);
        setIsSending(false);
        toast.success("Voters have been successfully sent");
      }
    } catch (error) {
      console.error(error);
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
          <div className="flex justify-between pb-2">
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
          <div className="flex justify-center">
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
        <div className="flex justify-end mt-3">
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
      />
    </div>
  );
};

export default VoterPage;
