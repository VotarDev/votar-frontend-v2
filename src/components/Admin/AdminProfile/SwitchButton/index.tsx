import React, { useState, useEffect } from "react";
import { adminPublishElection, getElectionById } from "@/utils/api";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import setAuthToken from "@/utils/setAuthToken";
import { Loader2 } from "lucide-react";
import { Switch } from "@/src/components/ui/switch";

interface SwitchButtonProps {
  id?: string | number;
  row?: any;
  userMail?: string;
  initialStatus?: boolean;
}

const SwitchButton = ({
  id,
  row,
  userMail,
  initialStatus,
}: SwitchButtonProps) => {
  const [isFetchElectionDetails, setIsFetchElectionDetails] = useState(false);
  const [electionStatus, setElectionStatus] = useState<boolean>(
    initialStatus || false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const getElectionDetails = async () => {
    if (initialStatus !== undefined) {
      setElectionStatus(initialStatus);
      return;
    }

    setIsFetchElectionDetails(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) setAuthToken(token);

    try {
      const { data } = await getElectionById({
        election_id: row.election_id,
      });
      if (data) {
        setElectionStatus(data.data.published);
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsFetchElectionDetails(false);
    }
  };

  useEffect(() => {
    getElectionDetails();
  }, []); // Empty dependency array - only run once on mount

  const handleChange = async (newStatus: boolean) => {
    setIsUpdating(true);

    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) {
      setAuthToken(token);
    }

    try {
      const status = newStatus ? "true" : "false";
      const bodyData = { election_id: row.election_id, state: status };
      const { data } = await adminPublishElection(bodyData);

      // Update local state immediately for better UX
      setElectionStatus(newStatus);
      toast.success("Election status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
      // Revert the checkbox state on error
      setElectionStatus(!newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      {isFetchElectionDetails ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-label="Loading" />
      ) : (
        <>
          <Switch
            checked={electionStatus}
            onCheckedChange={handleChange}
            disabled={isUpdating}
            aria-label={electionStatus ? "Unpublish election" : "Publish election"}
          />
          {isUpdating && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
          )}
        </>
      )}
    </div>
  );
};

export default SwitchButton;
