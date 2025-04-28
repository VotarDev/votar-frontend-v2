import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import BuyVotingCredit from "../BuyVotingCredit";
import Cookies from "universal-cookie";

const MiniDashboard = ({ election }: { election: any }) => {
  const [showModal, setShowModal] = useState(false);
  const cookie = new Cookies();
  const closeModal = () => setShowModal(false);
  const [votarCredits, setVotarCredits] = useState(
    cookie.get("votar-credits") || "0"
  );

  useEffect(() => {
    const cookie = new Cookies();

    const fetchCredits = () => {
      const credits = cookie.get("votar-credits");
      if (credits !== votarCredits) {
        setVotarCredits(credits);
      }
    };

    // Initial load
    fetchCredits();

    // Refresh when tab becomes visible again
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

  const voteNumber = votarCredits?.toString().split("");
  const freeVotes = election?.free_votes?.toString().split("");

  return (
    <div className="flex justify-center relative mt-12 px-4">
      <div className="lg:w-[551px] w-full max-w-[40rem] py-8 flex bg-slate-50 lg:rounded-full rounded-lg justify-center items-center lg:text-[24px] text-base font-semibold flex-col gap-6">
        <div className="flex justify-center items-center gap-10">
          <div className="text-right flex flex-col gap-3">
            <div>Free Votes</div>
            <div className="flex justify-end gap-2">
              {freeVotes === null && (
                <>
                  <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
                    0
                  </span>
                  <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
                    0
                  </span>
                </>
              )}
              {freeVotes?.map((num: any, index: any) => {
                const formatted = parseInt(num) < 10 ? `0${num}` : `${num}`;
                return (
                  <div key={index} className="flex gap-1">
                    {formatted.split("").map((digit, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="lg:text-[18px] text-base font-normal text-blue-700 underline">
              Login
            </div>
          </div>
          <div className="w-px h-28 border border-slate-900"></div>

          <div className="flex flex-col gap-3">
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
            <BuyVotingCredit election={election} setShowModal={setShowModal} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniDashboard;
