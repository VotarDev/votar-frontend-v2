import React, { useState, useEffect } from "react";
import { adminPublishElection } from "@/utils/api";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";

const SwitchButton = ({ id, row }: any) => {
  const handleChange = () => {};
  return (
    <div>
      <label className="toggle">
        <input
          className="toggle-checkbox"
          type="checkbox"
          onChange={handleChange}
        />
        <div className="toggle-switch"></div>
      </label>
    </div>
  );
};

export default SwitchButton;
