import React, { useState, useEffect } from "react";
import { BsCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { FaAnglesRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { drop } from "@/utils/util";
import { propsType, TrackeChanges } from "@/utils/types";

const DropdownComponent = ({ tracked, index }: propsType) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropDownContent, setDropdownContent] = useState<TrackeChanges[]>([]);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    tracked.filter((item: TrackeChanges) => {
      if (item.oldData.id === index + 1) {
        setDropdownContent((prev) => [...prev, item]);
        return item;
      }
    });
  }, [tracked, index]);

  const uniqueArr: TrackeChanges[] = Array.from(
    new Set(dropDownContent.map((obj) => JSON.stringify(obj)))
  ).map((str) => JSON.parse(str) as TrackeChanges);

  if (dropDownContent.length === 0) return null;

  return (
    <div className="relative max-w-full">
      <div
        className="flex items-center cursor-pointer text-xl font-semibold"
        onClick={toggleDropdown}
      >
        <span className="pl-1 text-green-500">
          {isDropdownOpen ? <BsFillCaretUpFill /> : <BsCaretDownFill />}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isDropdownOpen && (
          <motion.div
            className="absolute top-full -right-10 w-[350px] px-2 text-sm mt-2 bg-white shadow-[0px_4px_16px_0px_rgba(0_,0_,0_,0.08)] z-20"
            variants={drop}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {dropDownContent.length > 0 &&
              uniqueArr.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    <div className="py-2">
                      {item.changedData[0] === "name" && (
                        <div className="capitalize flex justify-center items-center gap-5">
                          <span>{item.oldData.name}</span>
                          <span className="text-green-500">
                            <FaAnglesRight />
                          </span>{" "}
                          <span>{item.newData.name}</span>
                        </div>
                      )}
                      {item.changedData[0] === "subGroup" && (
                        <div className="capitalize flex justify-center items-center gap-5">
                          <span>{item.oldData.subGroup}</span>
                          <span className="text-green-500">
                            <FaAnglesRight />
                          </span>{" "}
                          <span>{item.newData.subGroup}</span>
                        </div>
                      )}
                      {item.changedData[0] === "phone" && (
                        <div className="flex justify-center items-center gap-5">
                          <span>{item.oldData.phone}</span>
                          <span className="text-green-500">
                            <FaAnglesRight />
                          </span>{" "}
                          <span>{item.newData.phone}</span>
                        </div>
                      )}
                      {item.changedData[0] === "email" && (
                        <div className="flex justify-center items-center gap-5">
                          <span>{item.oldData.email}</span>
                          <span className="text-green-500">
                            <FaAnglesRight />
                          </span>{" "}
                          <span>{item.newData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownComponent;
