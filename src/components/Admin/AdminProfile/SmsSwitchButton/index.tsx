import React, { useState } from "react";
import toast from "react-hot-toast";
import { adminToggleSms } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";

interface SmsSwitchButtonProps {
  row?: any;
}

const SmsSwitchButton = ({ row }: SmsSwitchButtonProps) => {
  const [smsEnabled, setSmsEnabled] = useState<boolean>(
    Array.isArray(row?.notification_options)
      ? row.notification_options.includes("sms")
      : false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setIsUpdating(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) setAuthToken(token);
    try {
      await adminToggleSms({ election_id: row?.election_id, state: newStatus });
      setSmsEnabled(newStatus);
      toast.success(`SMS ${newStatus ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      setSmsEnabled(!newStatus);
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <label className="toggle">
      <input
        className="toggle-checkbox"
        type="checkbox"
        onChange={handleChange}
        checked={smsEnabled}
        disabled={isUpdating}
      />
      <div className="toggle-switch"></div>
    </label>
  );
};

export default SmsSwitchButton;
