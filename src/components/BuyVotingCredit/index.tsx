import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import check from "../../../public/assets/icons/vote.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { PiWarningCircleFill } from "react-icons/pi";
import { purchaseVotarCredit } from "@/utils/api";
import Cookies from "universal-cookie";
import { voterLoginCookieName } from "@/src/__env";
import setAuthToken from "@/utils/setAuthToken";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

const BuyVotingCredit = ({
  election,
  setShowModal,
}: {
  election: any;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [votarCredit, setVotarCredit] = useState(0);
  const { data: session, status } = useSession();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [votarCredits, setVotarCredits] = useState<any>(null);

  useEffect(() => {
    const cookie = new Cookies();
    const credits = cookie.get("votar-credits");
    if (credits) {
      setVotarCredits(credits);
    }
  }, []);

  console.log("election", election);
  const handleAddVotarCredit = (increment: boolean) => {
    if (increment) {
      let credit = Number(votarCredit);
      setVotarCredit((credit += 1));
    } else {
      let credit = Number(votarCredit);
      setVotarCredit((credit -= 1));
    }
  };

  const handlePurchaseVotarCredit = async () => {
    setIsPurchasing(true);
    const cookie = new Cookies();
    const token = cookie.get(voterLoginCookieName);
    try {
      if (token) {
        setAuthToken(token);
        console.log("token", token);
      }
      const bodyData = {
        email: session?.user?.email,
        amount: votarCredit,
        election_id: election?.election_id,
      };
      const { data } = await purchaseVotarCredit(bodyData);
      if (data) {
        console.log(data.data.votar_credits);
        toast.success("Votar Credit Purchased Successfully");
        setShowModal(false);
        cookie.set("votar-credits", data.data.votar_credits, { path: "/" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const voteNumber = votarCredits?.toString().split("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");

    if (!/^\d*$/.test(input)) return;

    const numericValue = parseInt(input || "0", 10);
    setVotarCredit(numericValue);
  };

  return (
    <div className="bg-white rounded-lg pt-[64px] pb-[83px] px-4 lg:px-10">
      <div className="text-blue-700 lg:text-2xl text-base font-semibold">
        Make your Preferred Candidate Emerge as the winner
        <br /> Purchase More Votar Credits
      </div>
      <div className="flex justify-center lg:text-2xl text-base pt-8 gap-2">
        All the Votar Credit You Need is Just a Button Away
        <span>
          <img
            src={check.src}
            alt="check icon"
            className="w-8 h-8 object-contain"
          />
        </span>
      </div>
      <div className="flex justify-center gap-10 p-5 mt-4 lg:text-xl text-base">
        <div className=" flex flex-col gap-3 text-center">
          <div>
            Votar
            <br /> Credits
          </div>
          <div>
            {/* <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
              0
            </span>
            <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
              3
            </span> */}
            <div className="flex justify-end gap-2 text-3xl">
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
          </div>
        </div>
        <div className="w-px h-[150px] border border-slate-900"></div>
        <div className="flex flex-col gap-3 text-center">
          <div>
            Add Votar
            <br /> Credit
          </div>
          <div className="flex gap-2">
            {/* <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
              0
            </span>
            <span className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded">
              0
            </span> */}
            <input
              type="text"
              value={votarCredit}
              className="text-center w-[100px] mx-auto text-3xl outline-none"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div>
              <button
                className={`w-10 h-10  bg-blue-700 rounded flex items-center justify-center text-neutral-100`}
                onClick={() => handleAddVotarCredit(false)}
                disabled={votarCredit <= 0}
              >
                <span className="text-xl">
                  <AiOutlineMinus />
                </span>
              </button>
            </div>
            <div>
              <button
                className={`w-10 h-10  bg-blue-700 rounded flex items-center justify-center text-neutral-100`}
                onClick={() => handleAddVotarCredit(true)}
              >
                <span className="text-xl">
                  <AiOutlinePlus />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          disabled={isPurchasing}
          onClick={handlePurchaseVotarCredit}
          className="h-14 bg-blue-700 rounded-lg outline-none px-10 flex justify-center items-center py-7 lg:text-2xl text-base text-zinc-100"
        >
          {isPurchasing
            ? "Processing..."
            : ` Make Payment Of NGN ${votarCredit.toLocaleString()} Votar Credits`}
        </button>
      </div>
      <div className=" flex items-center justify-center lg:text-[18px] text-sm text-center p-2 mt-7">
        <div className="bg-orange-100 p-2 flex items-center justify-center gap-2">
          <div className="text-[#ECAE0D]">
            <PiWarningCircleFill />
          </div>
          You need {election?.price_per_vote} Votar Credits to give 1 vote in
          your election.
        </div>
      </div>
    </div>
  );
};

export default BuyVotingCredit;
