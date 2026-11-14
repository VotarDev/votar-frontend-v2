import React, { useState, useEffect } from "react";
import { ChevronRight, CreditCard, MessageCircle, Zap } from "lucide-react";
import { useRouter } from "next/router";
import PaymentLayout from "@/src/components/Payment/PaymentLayout";
import { cancelPayment } from "@/src/components/Payment/paymentSession";
import PageLoader from "@/src/components/shared/PageLoader";

const METHODS = [
  {
    path: "card-method",
    icon: CreditCard,
    title: "Pay with card",
    description:
      "Pay securely with Paystack. Your credits are added as soon as the payment is confirmed.",
    badge: "Instant",
  },
  {
    path: "bank-transfer",
    icon: MessageCircle,
    title: "Chat with support",
    description:
      "Talk to our team on WhatsApp, phone or SMS and we'll top up your credits manually.",
  },
] as const;

const SelectPaymentMethod = () => {
  const router = useRouter();
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("payment_amount");
    if (!stored) {
      router.push("/");
    } else {
      setAmount(Number(stored));
    }
  }, []);

  if (amount === null) return <PageLoader message="Loading checkout" />;

  return (
    <PaymentLayout
      title="Choose how to pay"
      description="Pick a payment method for your Votar credits."
      amount={amount}
      onClose={cancelPayment}
    >
      <div className="space-y-3">
        {METHODS.map(({ path, icon: Icon, title, description, ...rest }) => (
          <button
            key={path}
            type="button"
            onClick={() => router.push(`/payment/${path}`)}
            className="group flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition-all hover:border-primary hover:bg-secondary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-foreground">{title}</span>
                {"badge" in rest && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Zap className="h-3 w-3" aria-hidden="true" />
                    {rest.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {description}
              </span>
            </span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </PaymentLayout>
  );
};

export default SelectPaymentMethod;
