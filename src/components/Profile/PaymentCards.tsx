import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { CreditCard, Loader2, Pencil, Plus, Wallet } from "lucide-react";
import { createWallet } from "@/utils/api";
import mastercard from "../../../public/assets/icons/mastercard.png";
import visacard from "../../../public/assets/icons/visa.jpeg";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import EmptyState from "@/src/components/shared/EmptyState";

interface PaymentCardsProps {
  /** The wallet from getCards; `card_stored` holds the saved cards. */
  debitCards: any;
  /** Set when the cards request failed, which means there's no wallet yet. */
  error: string | null;
  userId?: string;
  loadCard: boolean;
}

/** Saved payment cards, with the same wallet and add-card flow as before. */
const PaymentCards = ({
  debitCards,
  error,
  userId,
  loadCard,
}: PaymentCardsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cards: any[] = debitCards?.card_stored || [];

  // No wallet yet (the cards request failed): create one first, then add a card.
  const addCardHandler = async () => {
    if (error) {
      setIsLoading(true);
      try {
        const { data } = await createWallet(userId as string);
        if (data) {
          toast.success("Wallet created successfully");
          router.push(`/profile/billing/add`);
          return data;
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || error?.message || String(error),
        );
      } finally {
        setIsLoading(false);
      }
    }
    router.push(`/profile/billing/add`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-5 smm:flex-row smm:items-center smm:justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Payment cards</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Cards you&apos;ve saved for checkout, auto-renewals and topping up
            your balance.
          </p>
        </div>
        <Button
          onClick={addCardHandler}
          disabled={isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : error ? (
            <Wallet />
          ) : (
            <Plus />
          )}
          {error ? "Create wallet" : "Add new card"}
        </Button>
      </div>

      {loadCard ? (
        <div className="space-y-2 p-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={error ? "No wallet yet" : "No cards saved"}
          description={
            error
              ? "Create a wallet to start saving payment cards."
              : "Add a card to use it for checkout and top-ups."
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {cards.map((card, index) => {
            const isVisa = card.pseudo_card_number?.startsWith("4");
            return (
              <li key={index} className="flex items-center gap-4 p-5">
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-white">
                  <img
                    src={isVisa ? visacard.src : mastercard.src}
                    alt={isVisa ? "Visa" : "Mastercard"}
                    className="h-7 w-10 object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium capitalize text-foreground">
                    {card.bank_name || "Card"}
                    <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
                      •••• {card.pseudo_card_number?.slice(-4)}
                    </span>
                  </p>
                  <p className="truncate text-sm capitalize text-muted-foreground">
                    {card.billing_name}
                    {card.expire_date && ` · Expires ${card.expire_date}`}
                  </p>
                </div>
                {/* Same edit route as before. */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    router.push(`/profile/billing/edit/${index + 1}`)
                  }
                  className="shrink-0"
                >
                  <Pencil /> Edit
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default PaymentCards;
