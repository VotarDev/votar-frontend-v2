import React from "react";
import ActivityTable, { ActivityRow } from "../ActivityTable";
import { v4 as uuidv4 } from "uuid";

const VotarPro = ({ elections }: any) => {
  const rows: ActivityRow[] = elections.map((row: any) => ({
    key: uuidv4(),
    name: row.name_of_election,
    type: row.type,
    dateTime: `${row.start_date} - ${row.end_date}`,
    quantity: row.quantity,
    amount: "—",
    status: null,
  }));

  return <ActivityTable rows={rows} />;
};

export default VotarPro;
