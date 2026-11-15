import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ArrowRight, Info, Minus, Plus, Wallet, X } from "lucide-react";
import { RootState } from "@/redux/store";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";

const QUICK_VOTES = [1, 5, 10, 50];

/** Pick how many Votar credits to buy, then go to the payment page. */
const BuyVotingCredit = ({
  election,
  setShowModal,
  getVotarCredit,
}: {
  election: any;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  getVotarCredit?: () => void;
}) => {
  const [votarCredit, setVotarCredit] = useState(0);
  const credit = Number(
    useSelector((state: RootState) => state.votarCredit.credit) ?? 0,
  );
  const { pathname } = useRouter();
  const pricePerVote = Number(election?.price_per_vote ?? 0);
  // + and − move one vote's worth of credits (or 1 when votes are free).
  const step = pricePerVote > 0 ? pricePerVote : 1;

  // Refresh the balance when opened from a ballot, as before.
  useEffect(() => {
    if (getVotarCredit && pathname.includes("ballot")) {
      getVotarCredit();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(input)) return;
    setVotarCredit(parseInt(input || "0", 10));
  };

  const handleProceedToPayment = () => {
    if (votarCredit > 0) {
      const returnUrl = window.location.pathname + window.location.search;
      localStorage.setItem("payment_amount", votarCredit.toString());
      localStorage.setItem("payment_return_url", returnUrl);
      localStorage.setItem("election_id", election.election_id);
      localStorage.setItem("payment_auth_context", "voter");

      window.location.href = "/payment/select-method";
    }
  };

  const extraVotes =
    pricePerVote > 0 ? Math.floor(votarCredit / pricePerVote) : null;

  return (
    <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white text-left shadow-xl">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 smm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="buy-credits-title"
              className="text-lg font-semibold text-foreground"
            >
              Buy Votar credits
            </h2>
            <p className="text-sm text-muted-foreground">
              Give your preferred candidate more votes.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          aria-label="Close"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 overflow-y-auto px-5 py-5 smm:px-6">
        <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
          <span className="text-sm text-muted-foreground">Current balance</span>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {credit.toLocaleString()}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              credits
            </span>
          </span>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="credit-amount"
            className="text-sm font-medium text-foreground"
          >
            Credits to buy
          </label>
          <div className="flex items-stretch overflow-hidden rounded-xl border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
            <button
              type="button"
              onClick={() => setVotarCredit((v) => Math.max(0, v - step))}
              disabled={votarCredit <= 0}
              aria-label="Fewer credits"
              className="flex w-14 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              id="credit-amount"
              type="text"
              inputMode="numeric"
              value={votarCredit.toLocaleString()}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              className="h-14 min-w-0 flex-1 border-x border-input bg-transparent text-center text-2xl font-bold tabular-nums text-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => setVotarCredit((v) => v + step)}
              aria-label="More credits"
              className="flex w-14 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {extraVotes !== null && (
            <p className="text-sm text-muted-foreground">
              Enough for{" "}
              <span className="font-semibold text-foreground">
                {extraVotes.toLocaleString()} extra vote
                {extraVotes === 1 ? "" : "s"}
              </span>
            </p>
          )}
        </div>

        {pricePerVote > 0 && (
          <div className="flex flex-wrap gap-2">
            {QUICK_VOTES.map((votes) => {
              const amount = votes * pricePerVote;
              const selected = votarCredit === amount;
              return (
                <button
                  key={votes}
                  type="button"
                  onClick={() => setVotarCredit(amount)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-secondary text-primary"
                      : "border-border text-foreground hover:bg-muted",
                  )}
                >
                  {votes} vote{votes === 1 ? "" : "s"}
                </button>
              );
            })}
          </div>
        )}

        <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            You need {pricePerVote.toLocaleString()} Votar credits to give 1
            vote in this election. 1 credit costs ₦1.
          </span>
        </p>
      </div>

      <div className="border-t border-border px-5 py-4 smm:px-6">
        <Button
          onClick={handleProceedToPayment}
          disabled={votarCredit <= 0}
          className="h-12 w-full text-base"
        >
          Pay ₦{votarCredit.toLocaleString()} <ArrowRight />
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          You&apos;ll choose a payment method next.
        </p>
      </div>
    </div>
  );
};

export default BuyVotingCredit;
