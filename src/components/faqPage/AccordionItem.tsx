import React, { ReactNode } from "react";
import { Collapse } from "react-collapse";

const AccordionItem = ({ children, curOpen, onOpen, num, title }: any) => {
  const isOpen = num === curOpen;

  const handleToggle = () => {
    onOpen(isOpen ? false : num);
  };
  return (
    <div>
      <div
        onClick={handleToggle}
        className={`cursor-pointer bg-[#F9F9F9] ssm:py-[25px] py-[20px] px-[20px] ssm:px-[38px] flex justify-between  ${
          !isOpen ? "accordion-item" : ""
        } `}
      >
        <div className="lg:text-xl font-semibold ssm:text-[18px]">{title}</div>
        <div className="toggle-sign">
          <div className={`plus ${isOpen ? "checked" : ""}`}></div>
        </div>
      </div>
      <Collapse isOpened={isOpen}>
        <div className="leading-[1.6] ssm:py-[25px] py-[20px] px-[20px] ssm:px-[38px]">
          {children}
        </div>
      </Collapse>
    </div>
  );
};

export default AccordionItem;
