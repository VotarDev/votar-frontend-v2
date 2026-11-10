import React from "react";
import { activitiesContent } from "@/utils/util";
import ActivityTable, { ActivityRow } from "../ActivityTable";

const VotarMeeting = () => {
  const votarMeeting = activitiesContent.filter(
    (items) => items.type === "Votar Meeting"
  );

  const rows: ActivityRow[] = votarMeeting.map((row) => ({
    key: row.id,
    name: row.name,
    type: row.type,
    dateTime: (
      <>
        {row.date}
        <br />
        {row.time}
      </>
    ),
    quantity: row.quantity.toLocaleString(),
    amount: `NGN ${row.amount.toLocaleString()}`,
    status: {
      label: row.status,
      className:
        row.status === "pending"
          ? "bg-orange-50 text-[#E88749]"
          : "bg-green-50 text-green-500",
    },
  }));

  return <ActivityTable rows={rows} emptyMessage="No Votar Meeting activity yet" />;
};

export default VotarMeeting;
