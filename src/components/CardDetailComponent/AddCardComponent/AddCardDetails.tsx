import React from "react";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

const AddCardDetails = () => {
  const options = ["Default"];
  return (
    <div>
      <div className="max-w-[1000px]">
        <h1 className="text-3xl pb-3">Add New Card</h1>
        <hr></hr>
        <p className="py-5">
          Votar uses secure, encrypted technology to handle your credit card
          information. Rest assured the confidential
          <br />
          data you enter here is safe. Where possible, we&apos;ve pre-populated
          the entry fields on this page with your
          <br />
          previosly stored information.
        </p>
      </div>

      <div className="text-2xl pb-5">Card Details</div>

      <div className="max-w-[45rem] flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <label className="flex-1">Name on Card</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="flex-1">Card Number</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="flex-1">Card Name</label>
            <div className="flex-1 ">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <label className="flex-1">Use as</label>

            <div className=" text-[#454545] flex-1 flex flex-col gap-3">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disableRipple
                      style={{
                        margin: 0,
                        color: "#6a6a6a",
                      }}
                    />
                  }
                  label="Default for Apps Marketplace payments"
                />
              </FormGroup>
              <div>
                <p className="text-[#454545] border p-2 rounded">
                  This card will be used as the default payment method for all
                  apps marketplace payments.
                </p>
              </div>
              <div>
                <select className="w-full border outline-none px-4 py-1 bg-slate-100 rounded">
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-[#454545] border p-2 rounded">
                  This card will be used also as default card for your general
                  payments and renewals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCardDetails;
