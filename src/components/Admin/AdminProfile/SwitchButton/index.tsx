import React from "react";

const SwitchButton = () => {
  return (
    <div>
      <label className="toggle">
        <input className="toggle-checkbox" type="checkbox" />
        <div className="toggle-switch"></div>
      </label>
    </div>
  );
};

export default SwitchButton;
