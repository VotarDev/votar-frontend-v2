import React, { useState, ChangeEvent, FormEvent } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import VotersPageTable from "./components/VotersPageTable";

const VotersPage = () => {
  const [preference, setPreference] = useState("");
  const [text, setText] = useState("");
  const maxCharacterLength = 100;

  const handlePreference = (e: ChangeEvent<HTMLInputElement>) => {
    setPreference(e.target.value);
  };
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length <= maxCharacterLength) setText(inputValue);
  };
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
            <button className="w-32 h-12 flex items-center justify-center bg-blue-700 rounded-lg outline-none text-zinc-100 text-lg font-semibold">
              Send
            </button>
          </div>
        </form>
      </div>
      <VotersPageTable />
    </div>
  );
};

export default VotersPage;
