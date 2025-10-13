import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import BuyVotingCredit from "../BuyVotingCredit";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MiniDashboard = ({
  election,
  getVotarCredit,
}: {
  election: any;
  getVotarCredit?: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const cookie = new Cookies();
  const closeModal = () => setShowModal(false);
  const { pathname } = useRouter();
  const [votarCredits, setVotarCredits] = useState(
    cookie.get("votar-credits") || "0"
  );

  const credit = useSelector((state: RootState) => state.votarCredit.credit);

  useEffect(() => {
    const cookie = new Cookies();

    const fetchCredits = () => {
      const credits = cookie.get("votar-credits");
      if (credits !== votarCredits) {
        setVotarCredits(credits);
      }
    };

    fetchCredits();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCredits();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [votarCredits]);

  const voteNumber = credit?.toString().split("");
  const freeVotes = election?.free_votes?.toString().split("");

  return (
    <div className="flex justify-center relative mt-12 px-4">
      <div className="lg:w-[451px] w-full max-w-[40rem] py-8 flex bg-slate-50 lg:rounded-full rounded-lg justify-center items-center lg:text-[24px] text-base font-semibold flex-col gap-6">
        <div className="flex justify-center items-center gap-10">
          <div className="flex flex-col gap-3 text-center">
            <div>Votar Credits</div>

            <div className="flex  gap-2 ">
              {votarCredits === null && (
                <>
                  <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
                    0
                  </span>
                  <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
                    0
                  </span>
                </>
              )}
              {voteNumber?.map((num: any, index: any) => (
                <div
                  key={index}
                  className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded"
                >
                  {num}
                </div>
              ))}
            </div>
            <div className="lg:text-[18px] text-base font-normal text-blue-700 underline">
              Learn More
            </div>
          </div>
        </div>
        <div>
          <button
            className="bg-blue-700 outline-none lg:w-60 w-full h-14 flex items-center justify-center lg:text-[18px] text-base px-4 rounded-full text-zinc-100"
            onClick={() => setShowModal(true)}
          >
            Buy More Votar Credits
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showModal && (
          <Modal key="modal" handleClose={closeModal}>
            <BuyVotingCredit
              election={election}
              setShowModal={setShowModal}
              getVotarCredit={getVotarCredit}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniDashboard;
