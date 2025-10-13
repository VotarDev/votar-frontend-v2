import { AlertCircle, CheckCircle2, CreditCard, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface PaystackSetupOptions {
  key: string | undefined;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: any;
  callback?: (response: any) => void;
  onClose?: () => void;
}

interface PaystackPop {
  setup(options: PaystackSetupOptions): { openIframe: () => void };
}

declare global {
  interface Window {
    PaystackPop: PaystackPop;
  }
}

const CardMethod = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session, status } = useSession();

  const [amount, setAmount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const storedAmount = localStorage.getItem("payment_amount");
    if (!storedAmount) {
      router.push("/");
    } else {
      setAmount(parseInt(storedAmount));
    }
  }, []);

  const onBack = () => {
    router.back();
  };

  const handlePaystackPayment = () => {
    setIsProcessing(true);

    const PaystackPop = window.PaystackPop;
    const amount = parseInt(localStorage.getItem("payment_amount") || "0");

    const returnUrl = localStorage.getItem("payment_return_url");
    let electionId = null;

    if (returnUrl) {
      const url = new URL(returnUrl, window.location.origin);
      electionId = url.searchParams.get("candidate");
    }

    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session?.user?.email || "",
      amount: amount * 100,
      currency: "NGN",
      ref: `VOTAR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        election_id: electionId,
        custom_fields: [
          {
            display_name: "Election ID",
            variable_name: "election_id",
            value: electionId,
          },
        ],
      },
      callback: function (response: any) {
        setIsProcessing(false);

        const returnUrl = localStorage.getItem("payment_return_url") || "/";

        localStorage.removeItem("payment_amount");
        localStorage.removeItem("payment_return_url");
        localStorage.removeItem("election_id");

        const url = new URL(returnUrl, window.location.origin);
        url.searchParams.set("payment", "success");
        url.searchParams.set("reference", response.reference);

        window.location.href = url.toString();
      },
      onClose: function () {
        setIsProcessing(false);
        alert("Payment cancelled. Please try again.");
      },
    });

    handler.openIframe();
  };

  return (
    <div className="bg-white rounded-lg p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-blue-700 text-xl lg:text-2xl font-semibold">
          Card Payment
        </h2>
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900 text-center text-lg lg:text-xl font-semibold">
          Amount to Pay: NGN {amount.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white">
            <CreditCard size={32} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
          Secure Card Payment
        </h3>
        <p className="text-center text-gray-600 text-sm mb-4">
          You'll be redirected to Paystack to complete your payment securely
        </p>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={18} />
            <span>SSL Encrypted Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={18} />
            <span>Instant Credit Addition</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={18} />
            <span>Accept all major cards</span>
          </div>
        </div>
      </div>

      <div className="bg-orange-100 p-4 rounded-lg mb-6">
        <div className="flex gap-2 items-start">
          <AlertCircle
            className="text-[#ECAE0D] mt-1 flex-shrink-0"
            size={20}
          />
          <p className="text-sm text-gray-700">
            Your credits will be added immediately after successful payment
          </p>
        </div>
      </div>

      <button
        onClick={handlePaystackPayment}
        disabled={isProcessing}
        className="w-full h-14 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-lg text-white font-semibold text-lg transition-colors duration-200"
      >
        {isProcessing ? "Processing..." : "Proceed to Payment"}
      </button>

      <button
        onClick={onBack}
        disabled={isProcessing}
        className="w-full mt-3 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 rounded-lg text-gray-700 font-semibold transition-colors duration-200"
      >
        Choose Different Method
      </button>
    </div>
  );
};

export default CardMethod;
