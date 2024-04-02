import React from "react";
import VoteHeader from "@/src/components/VotePage/Header";
import MiniDashboard from "@/src/components/VotePage/MiniDashboard";
import VoteBody from "@/src/components/VotePage/VoteBody";

const Vote = () => {
  return (
    <div>
      <VoteHeader />
      <div className="px-4">
        <MiniDashboard />
        <VoteBody />
      </div>
    </div>
  );
};

export default Vote;
