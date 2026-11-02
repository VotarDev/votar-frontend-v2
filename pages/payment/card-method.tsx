import { AlertCircle, CheckCircle2, CreditCard, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { voterLoginCookieName } from "@/src/__env";
import setAuthToken from "@/utils/setAuthToken";
import { initializeVotarCreditPurchase, verifyVotarCreditPurchase } from "@/utils/api";

const CardMethod: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const reference = typeof router.query.reference === "string" ? router.query.reference : "";
    if (reference) {
      const cookie = new Cookies();
      const authContext = localStorage.getItem("payment_auth_context");
      const userToken = cookie.get("user-token");
      const voterToken = cookie.get(voterLoginCookieName);
      const token = authContext === "user"
        ? userToken || voterToken
        : voterToken || userToken;
      if (token) setAuthToken(token);
      setIsProcessing(true);
      verifyVotarCreditPurchase(reference).then(({ data }) => {
        const result = data?.data;
        if (!result) throw new Error("Payment verification returned no result");
        cookie.set("votar-credits", result.votar_credits, { path: "/" });
        toast.success(`${result.amount} Votar credits added`);
        const returnUrl = localStorage.getItem("payment_return_url") || "/";
        localStorage.removeItem("payment_amount");
        localStorage.removeItem("payment_return_url");
        localStorage.removeItem("election_id");
        localStorage.removeItem("payment_auth_context");
        const url = new URL(returnUrl, window.location.origin);
        url.searchParams.set("payment", "success");
        window.location.assign(url.toString());
      }).catch((error: any) => {
        toast.error(error?.response?.data?.message || "Payment could not be verified");
        setIsProcessing(false);
      });
      return;
    }
    const storedAmount = Number(localStorage.getItem("payment_amount"));
    if (!Number.isSafeInteger(storedAmount) || storedAmount <= 0) {
      toast.error("Payment amount not found. Please try again.");
      router.push("/");
      return;
    }
    setAmount(storedAmount);
  }, [router.isReady, router.query.reference, router]);

  const handlePaystackPayment = async () => {
    if (amount <= 0) {
      toast.error("Invalid payment amount. Please try again.");
      return;
    }
    const cookie = new Cookies();
    const authContext = localStorage.getItem("payment_auth_context");
    const userToken = cookie.get("user-token");
    const voterToken = cookie.get(voterLoginCookieName);
    const token = authContext === "user"
      ? userToken || voterToken
      : voterToken || userToken;
    if (!token) {
      toast.error("Please log in to proceed with payment.");
      return;
    }
    setAuthToken(token);
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

  return (
    <div className="bg-white rounded-lg p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-blue-700 text-xl lg:text-2xl font-semibold">Card Payment</h2>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-900 text-center text-lg lg:text-xl font-semibold">Amount to Pay: NGN {amount.toLocaleString()}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-4"><div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white"><CreditCard size={32} /></div></div>
        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Secure Card Payment</h3>
        <p className="text-center text-gray-600 text-sm mb-4">You’ll be redirected to Paystack to complete your payment securely.</p>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /><span>SSL encrypted payment</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /><span>Credits added after server verification</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /><span>Accepts major cards</span></div>
        </div>
      </div>
      <div className="bg-orange-100 p-4 rounded-lg mb-6"><div className="flex gap-2 items-start"><AlertCircle className="text-[#ECAE0D] mt-1 flex-shrink-0" size={20} /><p className="text-sm text-gray-700">Credits appear after Paystack confirms payment with our server.</p></div></div>
      <button onClick={handlePaystackPayment} disabled={isProcessing} className="w-full h-14 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-lg text-white font-semibold text-lg">{isProcessing ? "Processing..." : "Proceed to Payment"}</button>
      <button onClick={() => router.back()} disabled={isProcessing} className="w-full mt-3 h-12 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 rounded-lg text-gray-700 font-semibold">Choose Different Method</button>
    </div>
  );
};

export default CardMethod;
