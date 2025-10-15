import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React, { useRef } from "react";
import { IoCopy, IoCheckmarkCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaWhatsapp, FaPhone, FaMessage } from "react-icons/fa6";
import { MdSupportAgent, MdSecurity, MdPayment } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const PayPage = () => {
  const textRef = useRef<HTMLElement | null>(null);

  const handleCopyClick = async () => {
    if (textRef.current) {
      const selectedText = textRef.current.innerText;
      try {
        await navigator.clipboard.writeText(selectedText);
        toast.success("Phone number copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto  lg:px-8 py-8 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <MdPayment className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Activate your election and unlock the full potential of our voting
            platform
          </p>
        </div>

        {/* Important Notice Card */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <PiWarningCircleFill className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  You're Important to Us
                </h3>
                <div className="space-y-2 text-gray-700 leading-relaxed">
                  <p>
                    Thank you for choosing Votar. Your use of our platform
                    reflects your commitment to transparency and innovation.
                  </p>
                  <p>
                    We’d like to have a quick chat with you and share the
                    payment details for the purchase of your Votar credits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-6">
          {/* WhatsApp Option */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 lg:p-6 py-3 px-6 text-white">
              <div className="flex lg:items-center lg:gap-4 gap-2 lg:flex-row flex-col">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Preferred Method</h3>
                  <p className="text-green-100">
                    Quick and convenient payment discussion
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <a
                href="https://wa.me/2348144092733"
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <div className="flex items-center justify-center gap-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                  <FaWhatsapp className="w-6 h-6 text-green-600 " />
                  <span className="lg:text-lg text-sm font-medium text-green-700 text-center lg:text-left">
                    Start WhatsApp Chat for Payment
                  </span>
                </div>
              </a>
              <p className="text-center text-gray-600 text-sm mt-4">
                Click to chat with our payment specialist on WhatsApp
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-6 py-2 text-gray-500 font-medium rounded-full">
                OR
              </span>
            </div>
          </div>

          {/* Phone & SMS Options */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Alternative Contact Methods
              </h3>
              <p className="text-gray-600">
                Call us or send a text message for payment assistance
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Call Option */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaPhone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-blue-900">
                    Voice Call
                  </span>
                </div>
                <p className="text-blue-700 text-sm">
                  Speak directly with our payment team
                </p>
              </div>

              {/* SMS Option */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaMessage className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-purple-900">
                    Text Message
                  </span>
                </div>
                <p className="text-purple-700 text-sm">
                  Send us a text with your payment inquiry
                </p>
              </div>
            </div>

            {/* Phone Number Display */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4 text-lg">Contact us on:</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span
                  ref={textRef}
                  className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono"
                >
                  08144092733
                </span>
                <button
                  onClick={handleCopyClick}
                  className="group flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  title="Copy phone number"
                >
                  <IoCopy className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                Click the copy icon to copy the phone number
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPage;
