import React from "react";
import Image from "next/image";
import { ArrowLeft, Lock, X } from "lucide-react";
import logo from "@/public/assets/logos/votar-logo.svg";

interface PaymentLayoutProps {
  title: string;
  description?: string;
  /** Credits being bought (1 credit = ₦1). Hidden when not known yet. */
  amount?: number;
  /** "Back" arrow (to the previous step) or "close" (cancel the payment). */
  onBack?: () => void;
  backLabel?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

/** Shared frame for the payment pages: logo, step card and order summary. */
const PaymentLayout = ({
  title,
  description,
  amount,
  onBack,
  backLabel = "Back",
  onClose,
  children,
}: PaymentLayoutProps) => (
  <div className="min-h-screen bg-slate-50">
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <Image src={logo} alt="Votar" width={88} priority />
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          Secure checkout
        </span>
      </div>
    </header>

    <main className="mx-auto w-full max-w-xl px-4 py-6 smm:py-10">
      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4 smm:px-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="-ml-1.5 mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-foreground smm:text-xl">
              {title}
            </h1>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel payment"
              className="-mr-1.5 mt-0.5 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {amount !== undefined && amount > 0 && (
          <div className="flex items-center justify-between gap-4 border-b border-border bg-secondary/60 px-5 py-4 smm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Votar credits
              </p>
              <p className="font-semibold tabular-nums text-foreground">
                {amount.toLocaleString()} credits
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="text-xl font-bold tabular-nums text-primary">
                ₦{amount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="px-5 py-5 smm:px-6 smm:py-6">{children}</div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        All payments are secure and encrypted.
      </p>
    </main>
  </div>
);

export default PaymentLayout;
