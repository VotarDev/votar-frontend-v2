import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useDispatch } from "react-redux";
import { selected_plan } from "@/redux/features/votarPlan/votarPlanSlice";

const PlanChoice = () => {
  let plans: string | undefined;
  const [value, setValue] = useState<string | undefined>("");
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    setValue(value);
    localStorage.setItem("votar plan", JSON.stringify(value));
  };

  useEffect(() => {
    setValue(plans);
    dispatch(selected_plan(value));
  }, [plans, dispatch, value]);

  if (typeof window !== "undefined") {
    const planItem = localStorage.getItem("votar plan");
    if (planItem) {
      plans = JSON.parse(planItem);
    } else {
      plans = "";
    }
  }
  // console.log(plans);
  // console.log(value);

  return (
    <div className="lg:mt-[30px] mt-5">
      <FormControl style={{ width: "100%" }}>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
          row
        >
          <FormControlLabel
            value="Free Votar"
            control={
              <Radio
                name="myRadioGroup"
                checked={value == "Free Votar"}
                disableRipple
                sx={{
                  "&.Mui-checked": {
                    color: "#015CE9",
                  },
                }}
              />
            }
            label="Free Votar"
            style={{ minWidth: 125 }}
            sx={{
              "&.Mui-checked": {
                color: "#015CE9",
              },
            }}
          />
          <FormControlLabel
            value="Votar Pro"
            control={
              <Radio
                disableRipple
                checked={value == "Votar Pro"}
                sx={{
                  "&.Mui-checked": {
                    color: "#015CE9",
                  },
                }}
              />
            }
            label="Votar Pro"
            style={{ minWidth: 125 }}
            sx={{
              "&.Mui-checked": {
                color: "#015CE9",
              },
            }}
          />
          <FormControlLabel
            value="Votar Meeting"
            control={
              <Radio
                disabled
                disableRipple
                checked={value == "Votar Meeting"}
                sx={{
                  "&.Mui-checked": {
                    color: "#015CE9",
                  },
                }}
              />
            }
            label="Votar Meeting"
            style={{ minWidth: 125 }}
            sx={{
              "&.Mui-checked": {
                color: "#015CE9",
              },
            }}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default PlanChoice;
