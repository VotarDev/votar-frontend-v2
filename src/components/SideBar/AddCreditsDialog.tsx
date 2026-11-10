import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Cookies from "universal-cookie";
import Modal from "../Modal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { voterLoginCookieName } from "@/src/__env";
import setAuthToken from "@/utils/setAuthToken";

interface AddCreditsDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Amount entry for buying Votar credits. Unchanged flow: validate the amount,
 * remember it and where to come back to, then go to the payment method page.
 */
const AddCreditsDialog = ({ open, onClose }: AddCreditsDialogProps) => {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isSafeInteger(value) || value <= 0) {
      toast.error("Enter a valid credit amount");
      return;
    }
    const cookie = new Cookies();
    const token = cookie.get("user-token") || cookie.get(voterLoginCookieName);
    if (token) setAuthToken(token);
    localStorage.setItem("payment_amount", String(value));
    localStorage.setItem(
      "payment_return_url",
      window.location.pathname + window.location.search
    );
    localStorage.setItem("payment_auth_context", "user");
    onClose();
    router.push("/payment/select-method");
  };

  if (!isMounted) return null;

  // On <body> so the dialog covers the whole screen, above the layout.
  return createPortal(
    <div className="relative z-[1010]">
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="add-credits" handleClose={onClose}>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-sm rounded-lg bg-white p-6 text-left shadow-xl"
            >
              <h2 className="text-lg font-semibold text-foreground">
                Add Votar credits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter how many credits you want to buy. You&apos;ll choose how
                to pay next.
              </p>
              <label
                htmlFor="addCredit"
                className="mt-5 block text-sm font-medium text-foreground"
              >
                Number of credits
              </label>
              <Input
                id="addCredit"
                name="addCredit"
                inputMode="numeric"
                autoFocus
                placeholder="e.g. 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Continue to payment</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default AddCreditsDialog;
