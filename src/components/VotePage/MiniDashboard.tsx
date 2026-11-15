import React, { useEffect, useState } from "react";
import DialogShell from "@/src/components/shared/DialogShell";
import BuyVotingCredit from "../BuyVotingCredit";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/src/components/ui/button";

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

  const pricePerVote = Number(election?.price_per_vote ?? 0);

  return (
    <div className="relative mt-6 flex justify-center px-4 md:mt-10">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm ssm:p-5 smm:flex-row smm:items-center smm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Your Votar credits
            </p>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {Number(credit ?? 0).toLocaleString()}
            </p>
            {pricePerVote > 0 && (
              <p className="text-xs text-muted-foreground">
                Each extra vote costs{" "}
                <span className="font-semibold text-foreground">
                  ₦{pricePerVote.toLocaleString()}
                </span>
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="h-11 w-full shrink-0 smm:w-auto"
        >
          <Plus /> Buy credits
        </Button>
      </div>

      <DialogShell
        open={showModal}
        onClose={closeModal}
        labelledBy="buy-credits-title"
        className="max-w-md bg-transparent p-0 shadow-none"
      >
        <BuyVotingCredit
          election={election}
          setShowModal={setShowModal}
          getVotarCredit={getVotarCredit}
        />
      </DialogShell>
    </div>
  );
};

export default MiniDashboard;
