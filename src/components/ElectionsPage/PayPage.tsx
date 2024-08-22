import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React, { useRef } from "react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa6";

const PayPage = () => {
  const textRef = useRef<HTMLElement | null>(null);

  const handleCopyClick = async () => {
    if (textRef.current) {
      const selectedText = textRef.current.innerText;
      try {
        await navigator.clipboard.writeText(selectedText);

        toast.success("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };
  return (
    <div className="lg:my-[60px] my-10">
      <div className="flex flex-col gap-5">
        <div className="w-[90%] mx-auto bg-orange-100 p-6 rounded-lg leading-[1.7] text-xl ">
          <div className="flex gap-4 max-w-[50rem] mx-auto">
            <div className="text-[#ECAE0D] pt-2">
              <PiWarningCircleFill />
            </div>
            <div>
              <p>
                You are important to us, and we take your patronage of our
                service very seriously as you are part of the advanced thinkers
                creating a sustainable future by utilizing votar.
              </p>
              <p>
                We would like to have a brief chat with you and provide the
                payment details required for your election to be activated.
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="w-[90%] text-center mx-auto border-2 border-blue-600 p-6 rounded-lg text-blue-600 leading-[1.7] cursor-pointer flex justify-center gap-2 items-center text-lg hover:bg-blue-700 hover:text-white transition-all duration-150 ease-out">
            <div className="text-2xl">
              <FaWhatsapp />
            </div>
            <a
              href="https://wa.me/2348144092733"
              target="_blank"
              rel="noreferrer"
              className=""
            >
              Click here to have a whatsapp chat with us and make payment for
              your election
            </a>
          </div>
        </div>
        <div className="max-w-[40rem] mx-auto text-center text-lg mb-20">
          <div>OR</div>
          <div className="flex gap-2 items-center flex-wrap">
            Call us or send us a text message on:{" "}
            <div className="flex gap-2 items-center flex-wrap">
              {" "}
              <span ref={textRef}>08144092733</span>{" "}
              <div onClick={handleCopyClick} className="cursor-pointer">
                <IoCopy />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPage;
