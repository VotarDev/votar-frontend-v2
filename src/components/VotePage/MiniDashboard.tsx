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
    <div className="flex justify-center relative mt-8 md:mt-12 lg:mt-16 px-4 sm:px-6">
      <div className="w-full max-w-[40rem] lg:max-w-[500px] bg-white backdrop-blur-xs  rounded-lg shadow-md border border-slate-200/50 overflow-hidden">
        <div className="py-8 md:py-5 lg:py-5 px-6 sm:px-8 md:px-10 flex flex-col items-center gap-6 md:gap-8">
          {/* Credits Display Section */}
          <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
            <div className="flex flex-col gap-3 text-center w-full">
              {/* Title */}
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  Votar Credits
                </h2>
              </div>

              {/* Credit Number Display */}
              <div className="flex justify-center gap-2 md:gap-3 my-2 md:my-4">
                {votarCredits === null ? (
                  <>
                    <span className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl md:rounded-2xl shadow-lg font-bold text-xl md:text-2xl lg:text-3xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                      0
                    </span>
                    <span className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl md:rounded-2xl shadow-lg font-bold text-xl md:text-2xl lg:text-3xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
                      0
                    </span>
                  </>
                ) : (
                  voteNumber?.map((num: any, index: any) => (
                    <div
                      key={index}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl md:rounded-2xl shadow-lg font-bold text-xl md:text-2xl lg:text-3xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {num}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Buy More Credits Button */}
          <div className="w-full max-w-md">
            <button
              className="group relative w-full h-12 sm:h-14 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50 overflow-hidden"
              onClick={() => setShowModal(true)}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

              <span className="relative flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Buy More Votar Credits</span>
              </span>
            </button>

            {/* Helper text */}
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 md:mt-4">
              Secure payment • Instant delivery • 24/7 support
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
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
