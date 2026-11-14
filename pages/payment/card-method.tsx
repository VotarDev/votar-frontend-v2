import { AlertCircle, CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { voterLoginCookieName } from "@/src/__env";
import setAuthToken from "@/utils/setAuthToken";
import { initializeVotarCreditPurchase, verifyVotarCreditPurchase } from "@/utils/api";
import PaymentLayout from "@/src/components/Payment/PaymentLayout";
import { cancelPayment, getPaymentReturnUrl } from "@/src/components/Payment/paymentSession";
import { Button } from "@/src/components/ui/button";
import PageLoader from "@/src/components/shared/PageLoader";

// Same token choice as before: the organiser's or the voter's, depending on
// where the purchase started.
const authorise = () => {
  const cookie = new Cookies();
  const authContext = localStorage.getItem("payment_auth_context");
  const userToken = cookie.get("user-token");
  const voterToken = cookie.get(voterLoginCookieName);
  const token =
    authContext === "user" ? userToken || voterToken : voterToken || userToken;
  if (token) setAuthToken(token);
  return token;
};

type VerifyState = "idle" | "verifying" | "success" | "failed";

const CardMethod: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [verifyError, setVerifyError] = useState("");
  const [creditsAdded, setCreditsAdded] = useState<number | null>(null);
  const router = useRouter();
  const reference =
    typeof router.query.reference === "string" ? router.query.reference : "";

  // Paystack sends the voter back here with ?reference=…; confirm it with our
  // server, then return to where the purchase started.
  const verify = useCallback(() => {
    if (!reference) return;
    const cookie = new Cookies();
    authorise();
    setVerifyState("verifying");
    setVerifyError("");
    verifyVotarCreditPurchase(reference)
      .then(({ data }) => {
        const result = data?.data;
        if (!result) throw new Error("Payment verification returned no result");
        cookie.set("votar-credits", result.votar_credits, { path: "/" });
        setCreditsAdded(Number(result.amount));
        setVerifyState("success");
        toast.success(`${result.amount} Votar credits added`);
        const returnUrl = getPaymentReturnUrl();
        localStorage.removeItem("payment_amount");
        localStorage.removeItem("payment_return_url");
        localStorage.removeItem("election_id");
        localStorage.removeItem("payment_auth_context");
        const url = new URL(returnUrl, window.location.origin);
        url.searchParams.set("payment", "success");
        // A moment on the success screen before heading back.
        window.setTimeout(() => window.location.assign(url.toString()), 1500);
      })
      .catch((error: any) => {
        const message =
          error?.response?.data?.message || "Payment could not be verified";
        toast.error(message);
        setVerifyError(message);
        setVerifyState("failed");
      });
  }, [reference]);

  useEffect(() => {
    if (!router.isReady) return;
    if (reference) {
      verify();
      return;
    }
    const storedAmount = Number(localStorage.getItem("payment_amount"));
    if (!Number.isSafeInteger(storedAmount) || storedAmount <= 0) {
      toast.error("Payment amount not found. Please try again.");
      router.push("/");
      return;
    }
    setAmount(storedAmount);
  }, [router.isReady, reference, verify, router]);

  const handlePaystackPayment = async () => {
    if (!amount || amount <= 0) {
      toast.error("Invalid payment amount. Please try again.");
      return;
    }
    if (!authorise()) {
      toast.error("Please log in to proceed with payment.");
      return;
    }
    setIsProcessing(true);
    try {
      const { data } = await initializeVotarCreditPurchase({
        amount,
        callback_url: `${window.location.origin}/payment/card-method`,
      });
      const authorizationUrl = data?.data?.authorization_url;
      if (!authorizationUrl) throw new Error("Paystack checkout was not initialized");
      window.location.assign(authorizationUrl);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Unable to start payment");
      setIsProcessing(false);
    }
  };

  // Back from Paystack: confirming, confirmed, or couldn't confirm.
  if (reference) {
    return (
      <PaymentLayout title="Card payment">
        <div className="flex flex-col items-center py-4 text-center">
          {verifyState === "failed" ? (
            <>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertCircle className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-foreground">
                We couldn&apos;t confirm your payment
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {verifyError}. If you were charged, try again in a moment or
                contact support with this reference:
              </p>
              <code className="mt-3 break-all rounded-md bg-muted px-3 py-1.5 text-xs text-foreground">
                {reference}
              </code>
              <div className="mt-6 flex w-full flex-col gap-2 smm:flex-row smm:justify-center">
                <Button variant="outline" onClick={cancelPayment} className="h-11">
                  Back to Votar
                </Button>
                <Button onClick={verify} className="h-11">
                  Try again
                </Button>
              </div>
            </>
          ) : verifyState === "success" ? (
            <>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-foreground">
                Payment confirmed
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {creditsAdded?.toLocaleString()} Votar credits have been added.
                Taking you back…
              </p>
            </>
          ) : (
            <>
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">
                Confirming your payment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This only takes a moment. Please don&apos;t close this page.
              </p>
            </>
          )}
        </div>
      </PaymentLayout>
    );
  }

  if (amount === null) return <PageLoader message="Loading checkout" />;

  return (
    <PaymentLayout
      title="Pay with card"
      description="You'll finish paying on Paystack's secure page."
      amount={amount}
      onBack={() => router.push("/payment/select-method")}
      backLabel="Choose a different method"
      onClose={cancelPayment}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <CreditCard className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-foreground">Secure card payment</p>
          <p className="text-sm text-muted-foreground">
            Visa, Mastercard and Verve, processed by Paystack.
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 text-sm text-foreground">
        {[
          "Encrypted payment. Votar never sees your card details.",
          "Credits are added once Paystack confirms the payment with our server.",
          "You'll come straight back here when you're done.",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <Button
        onClick={handlePaystackPayment}
        disabled={isProcessing}
        className="mt-6 h-12 w-full text-base"
      >
        {isProcessing && <Loader2 className="animate-spin" />}
        {isProcessing ? "Opening Paystack…" : `Pay ₦${amount.toLocaleString()}`}
      </Button>
      <Button
        variant="ghost"
        onClick={() => router.push("/payment/select-method")}
        disabled={isProcessing}
        className="mt-2 h-11 w-full"
      >
        Choose a different method
      </Button>
    </PaymentLayout>
  );
};

export default CardMethod;
