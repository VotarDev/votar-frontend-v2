import React, { useEffect, useRef } from "react";
import { Collapse } from "react-collapse";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

const AccordionItem = ({ children, curOpen, onOpen, num, title }: any) => {
  const isOpen = num === curOpen;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const handleToggle = () => {
    onOpen(isOpen ? false : num);
  };

  const copyLink = () => {
    const faqId = `faq-${num}`;
    const link = `${window.location.origin}/faq#${faqId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    const faqId = `faq-${num}`;
    if (window.location.hash === `#${faqId}`) {
      onOpen(num);
      itemRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [num, onOpen]);
  return (
    <div className="mb-5 relative">
      <div
        onClick={handleToggle}
        className={`cursor-pointer bg-[#F9F9F9] ssm:py-[25px] py-[20px] px-[20px] ssm:px-[38px] flex justify-between  ${
          !isOpen ? "accordion-item" : ""
        } `}
      >
        <div
          className="absolute right-[45px] top-2 text-xs flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            copyLink();
          }}
        >
          Copy FAQ Link
          <span>
            <IoCopy />
          </span>
        </div>
        <div className="lg:text-xl font-semibold ssm:text-[18px]">
          <h2>{title}</h2>
        </div>
        <div className="toggle-sign">
          <div className={`plus ${isOpen ? "checked" : ""}`}></div>
        </div>
      </div>
      <Collapse isOpened={isOpen}>
        <div className="leading-[1.6] ssm:py-[25px] py-[20px] px-[20px] ssm:px-[38px]">
          <p>{children}</p>
        </div>
      </Collapse>
    </div>
  );
};

export default AccordionItem;
