import React, { memo, useState, useEffect } from "react";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { CircularProgress, TableRow } from "@mui/material";
import { toast } from "react-hot-toast";

interface UserRowProps {
  row: any;
  index: number;
  topUpAmounts: Record<string, string>;
  setTopUpAmounts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  adminTopUpVotarCredit: (email: string, amount: number) => Promise<void>;
  loadingUserEmail: string | null;
  StyledTableCell: any;
}

const UserRow = memo(function UserRow({
  row,
  index,
  topUpAmounts,
  setTopUpAmounts,
  adminTopUpVotarCredit,
  loadingUserEmail,
  StyledTableCell,
}: UserRowProps) {
  const key = row.email;

  const [localValue, setLocalValue] = useState(topUpAmounts[key] ?? "");

  useEffect(() => {
    setLocalValue(topUpAmounts[key] ?? "");
  }, [topUpAmounts[key]]);

  const handleChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setLocalValue(cleaned);

    setTopUpAmounts((prev) => ({
      ...prev,
      [key]: cleaned,
    }));
  };

  return (
    <TableRow key={key}>
      <StyledTableCell align="center">
        {index <= 8 ? `0${index + 1}` : index + 1}
      </StyledTableCell>

      <StyledTableCell align="center">{row.email}</StyledTableCell>
      <StyledTableCell align="center">{row.votar_credit}</StyledTableCell>

      <StyledTableCell align="center">
        <div className="flex items-center justify-center gap-3 bg-neutral-100 rounded-lg p-2">
          <button
            onClick={() =>
              handleChange(String(Math.max(0, Number(localValue || 0) - 1)))
            }
            className="text-blue-600 hover:text-blue-800 text-xl"
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
            className="w-20 h-10 rounded-lg border border-gray-300 px-2 text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={() => handleChange(String(Number(localValue || 0) + 1))}
            className="text-blue-600 hover:text-blue-800 text-xl"
          >
            <BiPlusCircle />
          </button>

          <button
            onClick={(e) => {
              const amount = localValue;
              if (amount && Number(amount) > 0) {
                adminTopUpVotarCredit(row.email, Number(amount));
              } else {
                e.currentTarget.blur();
                toast.error("Please enter a valid amount before topping up");
              }
            }}
            disabled={loadingUserEmail === row.email || !localValue}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              loadingUserEmail === row.email
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800 text-white"
            }`}
          >
            {loadingUserEmail === row.email ? (
              <CircularProgress size={16} style={{ color: "white" }} />
            ) : (
              "Top Up"
            )}
          </button>
        </div>
      </StyledTableCell>
    </TableRow>
  );
});

export default UserRow;
