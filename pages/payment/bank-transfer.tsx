import { AlertCircle, CheckCircle2, Copy, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const BankTransfer = () => {
  const router = useRouter();
  const [copied, setCopied] = useState("");
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountNumber: "1234567890",
    accountName: "Votar Credits Limited",
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  useEffect(() => {
    const storedAmount = localStorage.getItem("payment_amount");
    if (!storedAmount) {
      router.push("/");
    } else {
      setAmount(parseInt(storedAmount));
    }
  }, []);
  const onComplete = () => {
    const returnUrl = localStorage.getItem("payment_return_url") || "/";
    localStorage.removeItem("payment_amount");
    localStorage.removeItem("payment_return_url");
    localStorage.removeItem("election_id");

    const url = new URL(returnUrl, window.location.origin);
    url.searchParams.set("payment", "success");

    window.location.href = url.toString();
  };

  const handleComplete = () => {
    setIsProcessing(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 3000);
  };

  const onBack = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-lg p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-blue-700 text-xl lg:text-2xl font-semibold">
          Bank Transfer Details
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

      <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Transfer to this account:
        </h3>

        {/* Bank Name */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Bank Name</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900">
              {bankDetails.bankName}
            </p>
            <button
              onClick={() => copyToClipboard(bankDetails.bankName, "bank")}
              className="text-blue-700 hover:text-blue-800 transition-colors"
            >
              {copied === "bank" ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Account Number */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Account Number</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900">
              {bankDetails.accountNumber}
            </p>
            <button
              onClick={() =>
                copyToClipboard(bankDetails.accountNumber, "account")
              }
              className="text-blue-700 hover:text-blue-800 transition-colors"
            >
              {copied === "account" ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Account Name */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Account Name</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900">
              {bankDetails.accountName}
            </p>
            <button
              onClick={() => copyToClipboard(bankDetails.accountName, "name")}
              className="text-blue-700 hover:text-blue-800 transition-colors"
            >
              {copied === "name" ? (
                <CheckCircle2 size={20} className="text-green-600" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-100 p-4 rounded-lg mb-6">
        <div className="flex gap-2 items-start">
          <AlertCircle
            className="text-[#ECAE0D] mt-1 flex-shrink-0"
            size={20}
          />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-2">Important Instructions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Transfer the exact amount shown above</li>
              <li>Your credits will be added within 5-10 minutes</li>
              <li>Keep your transfer receipt for reference</li>
              <li>
                Contact support if credits aren't received after 30 minutes
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={isProcessing}
        className="w-full h-14 bg-blue-700 hover:bg-blue-800 rounded-lg text-white font-semibold text-lg transition-colors duration-200"
      >
        {isProcessing ? "Verifying..." : "I Have Completed the Transfer"}
      </button>

      <button
        onClick={onBack}
        className="w-full mt-3 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold transition-colors duration-200"
      >
        Choose Different Method
      </button>
    </div>
  );
};

export default BankTransfer;
