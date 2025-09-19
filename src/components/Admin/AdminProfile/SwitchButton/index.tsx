import React, { useState, useEffect } from "react";
import { adminPublishElection, getElectionById } from "@/utils/api";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

interface SwitchButtonProps {
  id: string;
  row: any;
  userMail: string;
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

  // Remove the useEffect that causes infinite re-renders
  // Only fetch election details if initialStatus is not provided
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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
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
    <div>
      {isFetchElectionDetails || isUpdating ? (
        <CircularProgress size={20} style={{ color: "#015CE9" }} />
      ) : (
        <label className="toggle">
          <input
            className="toggle-checkbox"
            type="checkbox"
            onChange={handleChange}
            checked={electionStatus}
            disabled={isUpdating}
          />
          <div className="toggle-switch"></div>
        </label>
      )}
    </div>
  );
};

export default SwitchButton;
