import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import VotersPageTable from "../CreateElection/Steps/components/VotersPageTable";
import { VoterResponse } from "@/utils/types";
import { sendVoterCred } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";

const VoterPage = () => {
  const [preference, setPreference] = useState("");
  const [text, setText] = useState("");
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [isSending, setIsSending] = useState(false);
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
          electionId,
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
            <button
              disabled={isSending}
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

export default VoterPage;
