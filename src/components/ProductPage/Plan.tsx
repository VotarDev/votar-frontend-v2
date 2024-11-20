import React from "react";
import record from "../../../public/assets/icons/record.svg";
import graph from "../../../public/assets/icons/graph.svg";
import note from "../../../public/assets/icons/note.svg";
import Image from "next/image";

const Plan = () => {
  return (
    <div>
      <div className="lg:text-4xl text-2xl text-center font-bold mt-10 text-[#015CE9] px-4 lg:px-0 lg:pt-20">
        <h1>Every Plan Includes</h1>
      </div>
      <div className="flex flex-wrap justify-center text-center lg:gap-[172px] gap-10 mt-[52px]">
        <div>
          <div className="h-10 flex items-center text-[30px] font-semibold gap-2 justify-center">
            <span>
              <Image
                src={record.src}
                alt="record icon"
                height={0}
                width={0}
                style={{ width: "40px", height: "auto" }}
              />
            </span>{" "}
            <p>Live</p>
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            <p>
              Live Updates/
              <br />
              Transimission of
              <br /> election results
            </p>
          </div>
        </div>
        <div>
          <div className="h-10 flex justify-center">
            <Image
              src={graph}
              alt="graph icon"
              height={0}
              width={0}
              style={{ width: "40px", height: "auto" }}
            />
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            <p>
              Analytics Tool for
              <br /> Election Result
            </p>
          </div>
        </div>
        <div>
          <div className="h-10 flex justify-center">
            <Image
              src={note}
              alt="note icon"
              height={0}
              width={0}
              style={{ width: "40px", height: "auto" }}
            />
          </div>
          <div className="lg:text-xl text-[18px] font-semibold text-[#060606] p-4">
            <p>
              Branded Ballots with
              <br /> colors, Logs of
              <br /> Information set by the
              <br /> Organizers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
