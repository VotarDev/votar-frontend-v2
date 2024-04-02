import React, { useState } from "react";
import Header from "../../BallotPage/Header";
import Body from "../../BallotPage/Body";

const Ballot = ({ positions, setPositions }: any) => {
  return (
    <div className="my-[60px]">
      <Header />
      <Body setPositions={setPositions} positions={positions} />
    </div>
  );
};

export default Ballot;
