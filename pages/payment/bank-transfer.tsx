import { Check, Copy, MessageSquare, Phone } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa6";
import PaymentLayout from "@/src/components/Payment/PaymentLayout";
import { cancelPayment } from "@/src/components/Payment/paymentSession";
import { Button } from "@/src/components/ui/button";
import PageLoader from "@/src/components/shared/PageLoader";

const SUPPORT_PHONE = "08144092733";
const SUPPORT_PHONE_INTL = "2348144092733";

/** Pay by talking to Votar's team, who top up the credits manually. */
const BankTransfer = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedAmount = localStorage.getItem("payment_amount");
    if (!storedAmount) {
      router.push("/");
    } else {
      setAmount(parseInt(storedAmount));
    }
  }, []);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_PHONE);
      setCopied(true);
      toast.success("Phone number copied to clipboard!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Copy operation failed. Please try again.");
    }
  };

  if (amount === null) return <PageLoader message="Loading checkout" />;

  const message = encodeURIComponent(
    `Hello Votar, I'd like to buy ${amount.toLocaleString()} Votar credits (₦${amount.toLocaleString()}).`,
  );

  return (
    <PaymentLayout
      title="Chat with support"
      description="Our team will share payment details and top up your credits."
      amount={amount}
      onBack={() => router.push("/payment/select-method")}
      backLabel="Choose a different method"
      onClose={cancelPayment}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Thank you for choosing Votar. Reach out on WhatsApp (fastest), or call
        or text us, and we&apos;ll send you the payment details. Your credits
        are added once we&apos;ve confirmed the payment.
      </p>

      <a
        href={`https://wa.me/${SUPPORT_PHONE_INTL}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1ebe5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
        Chat on WhatsApp
      </a>

      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or call / text
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Payment team
            </p>
            <p className="font-mono text-xl font-bold tracking-wide text-foreground smm:text-2xl">
              {SUPPORT_PHONE}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyPhone}
            aria-label="Copy phone number"
            className="shrink-0"
          >
            {copied ? <Check className="text-emerald-600" /> : <Copy />}
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button asChild variant="secondary" className="h-11">
            <a href={`tel:${SUPPORT_PHONE}`}>
              <Phone /> Call
            </a>
          </Button>
          <Button asChild variant="secondary" className="h-11">
            <a href={`sms:${SUPPORT_PHONE}?body=${message}`}>
              <MessageSquare /> Text
            </a>
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push("/payment/select-method")}
        className="mt-5 h-11 w-full"
      >
        Choose a different method
      </Button>
    </PaymentLayout>
  );
};

export default BankTransfer;
