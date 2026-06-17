import React, { useState } from "react";
import toast from "react-hot-toast";

interface SmsSwitchButtonProps {
  row?: any;
}

const SmsSwitchButton = ({ row }: SmsSwitchButtonProps) => {
  const [smsEnabled, setSmsEnabled] = useState<boolean>(
    row?.sms_enabled ?? false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setIsUpdating(true);
    try {
      // TODO: wire up to /admin/send-sms endpoint when available
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
