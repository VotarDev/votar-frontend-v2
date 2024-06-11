import React from "react";

import Chat from "@/src/components/Chat";
import Header from "@/src/components/VoteAccess/Header";
import ElectionId from "@/src/components/VoteAccess/ElectionId";

const Access = () => {
  return (
    <>
      <Header />
      {/* <ElectionId electionId=""/> */}
      <Chat />
    </>
  );
};

export default Access;
