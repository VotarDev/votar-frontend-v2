import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Building2,
  CreditCard,
  X,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/router";

const SelectPaymentMethod = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    const amount = localStorage.getItem("payment_amount");
    if (!amount) {
      router.push("/");
    } else {
      setAmount(Number(amount));
    }
  }, []);

  const onBack = () => {
    router.back();
  };

  const onSelectMethod = (method: string) => {
    router.push(`/payment/${method}`);
  };

  return (
    <div className="bg-white rounded-lg p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-blue-700 text-xl lg:text-2xl font-semibold">
          Select Payment Method
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectMethod("bank-transfer")}
          className="bg-white border-2 border-blue-700 rounded-lg p-6 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <MessageCircle size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Chat with Support
              </h3>
              <p className="text-sm text-gray-600">
                Talk to our team to make a payment, and we’ll manually top up
                your Votar credits.
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectMethod("card-method")}
          className="bg-white border-2 border-blue-700 rounded-lg p-6 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <CreditCard size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Pay with Your Card
              </h3>
              <p className="text-sm text-gray-600">
                Buy credits instantly and securely — they’ll show up in your
                account right away!
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center text-sm text-center p-2 mt-6">
        <div className="bg-orange-100 p-3 rounded-lg flex items-center justify-center gap-2">
          <AlertCircle className="text-[#ECAE0D]" size={20} />
          <span className="text-gray-700">
            All payments are secure and encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectPaymentMethod;
