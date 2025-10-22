import React from "react";
import chat from "../../public/assets/icons/messages-2.svg";
import { BsWhatsapp } from "react-icons/bs";

const Chat = () => {
  return (
    <div className="fixed bottom-[20px] z-20 right-7 lg:w-[77px] lg:h-[77px] w-[60px] h-[60px] flex items-center justify-center bg-[#25D366] rounded-[50%] ">
      <a
        href="https://api.whatsapp.com/send?phone=2348144092733&text=Good%20day%20Votar%20How%20can%20i%20enroll?"
        target="_blank"
        rel="nonreferrer"
      >
        <BsWhatsapp className="text-white text-[30px]" />
      </a>
    </div>
  );
};

export default Chat;
