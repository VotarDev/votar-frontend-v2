import React, { memo, useState } from "react";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

interface UserCardProps {
  row: any;
  serialNumber: number;
  adminTopUpVotarCredit: (email: string, amount: number) => Promise<void>;
  loadingUserEmail: string | null;
}

const UserCard = memo(function UserCard({
  row,
  serialNumber,
  adminTopUpVotarCredit,
  loadingUserEmail,
}: UserCardProps) {
  const [localValue, setLocalValue] = useState("");

  const handleChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setLocalValue(cleaned);
  };

  const handleTopUp = async () => {
    const amount = localValue;
    if (amount && Number(amount) > 0) {
      await adminTopUpVotarCredit(row.email, Number(amount));
      setLocalValue("");
    } else {
      toast.error("Please enter a valid amount before topping up");
    }
  };

  const isLoading = loadingUserEmail === row.email;

  return (
    <div className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-gray-400">
            #{serialNumber <= 9 ? `0${serialNumber}` : serialNumber}
          </div>
          <div className="truncate text-sm font-semibold text-gray-800">
            {row.email}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#015CE9]/10 px-3 py-1 text-xs font-bold text-[#015CE9]">
          {row.votar_credit} credits
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-100 p-2">
        <button
          type="button"
          onClick={() =>
            handleChange(String(Math.max(0, Number(localValue || 0) - 1)))
          }
          className="shrink-0 text-xl text-blue-600 hover:text-blue-800"
        >
          <BiMinusCircle />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter amount"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 px-2 text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => handleChange(String(Number(localValue || 0) + 1))}
          className="shrink-0 text-xl text-blue-600 hover:text-blue-800"
        >
          <BiPlusCircle />
        </button>
      </div>

      <button
        type="button"
        onClick={handleTopUp}
        disabled={isLoading || !localValue}
        className={`mt-2 w-full rounded-lg py-2.5 text-sm font-semibold transition-all ${
          isLoading
            ? "cursor-not-allowed bg-blue-300"
            : "bg-blue-700 text-white hover:bg-blue-800"
        }`}
      >
        {isLoading ? (
          <CircularProgress size={16} style={{ color: "white" }} />
        ) : (
          "Top Up"
        )}
      </button>
    </div>
  );
});

export default UserCard;
