import React, { useState } from "react";
import toast from "react-hot-toast";
import { adminToggleSms } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { Loader2 } from "lucide-react";
import { Switch } from "@/src/components/ui/switch";

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

  const handleChange = async (newStatus: boolean) => {
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
    <div className="inline-flex items-center gap-2">
      <Switch
        checked={smsEnabled}
        onCheckedChange={handleChange}
        disabled={isUpdating}
        aria-label={smsEnabled ? "Turn off SMS" : "Turn on SMS"}
      />
      {isUpdating && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  );
};

export default SmsSwitchButton;
