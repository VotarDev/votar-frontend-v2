import React, { useState } from "react";
import { BsCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { FaAnglesRight } from "react-icons/fa6";
import { motion, Variants } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { TrackeChanges } from "@/utils/types";

interface DropdownProps {
  tracked: TrackeChanges[];
  voterId: string | number;
}

const drop: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const DropdownComponent = ({ tracked, voterId }: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (tracked.length === 0) return null;

  return (
    <div className="relative max-w-full">
      <div
        className="flex items-center justify-center cursor-pointer text-xl font-semibold"
        onClick={toggleDropdown}
      >
        <span className="text-green-500">
          {isDropdownOpen ? <BsFillCaretUpFill /> : <BsCaretDownFill />}
        </span>
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute top-full -left-1/2 transform  w-[400px] max-h-64 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 z-20 p-4"
            variants={drop}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#015ce9 #f5f5f5",
            }}
          >
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              Changes for Voter ID: {voterId}
            </h3>
            {tracked.map((item, index) => (
              <div
                key={index}
                className="py-2 border-b border-gray-100 last:border-b-0"
              >
                {item.changedData.map((field, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-3 text-sm"
                  >
                    <span className="capitalize text-gray-600">{field}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800">
                        {item.oldData[field] || "N/A"}
                      </span>
                      <span className="text-green-500">
                        <FaAnglesRight />
                      </span>
                      <span className="text-gray-800">
                        {item.newData[field] || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownComponent;
