import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import VotersPageTable from "./components/VotersPageTable";
import { VoterResponse } from "@/utils/types";
import { getElectionById, sendVoterCred } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";

const VotersPage = () => {
  const [preference, setPreference] = useState("");
  const [text, setText] = useState("");
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [election, setElection] = useState<any>([]);
  const maxCharacterLength = 100;
  const users = useCurrentUser();
  const user = useUser();

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
          election_id: electionId,
          voters: credentials,
        };
        const { data } = await sendVoterCred(credentialsData, USER_ID);
        if (data) {
          console.log(data);
          setIsSending(false);
          toast.success("Voters Credentials sent successfully");
        }
      }
    } catch (e: any) {
      console.log(e);
      toast.error("An error occurred, please try again");
      setIsSending(false);
    }
  };

  useEffect(() => {
    const getElection = async () => {
      setIsloading(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        const electionId = localStorage.getItem("ElectionId");
        console.log(electionId);
        if (electionId) {
          const electionData = { election_id: electionId };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            setIsloading(false);
          }
        }
      } catch (e: any) {
        console.log(e?.response?.data?.message);
        setIsloading(false);
      }
    };
    getElection();
  }, []);

  console.log(election?.published);

  console.log(selectedRows);

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
      </div>
      <VotersPageTable
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
};

export default VotersPage;
