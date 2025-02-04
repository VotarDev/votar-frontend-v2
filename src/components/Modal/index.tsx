import React from "react";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import { dropIn } from "@/utils/util";

const Modal = ({ handleClose, children, classname }: any) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`flex flex-col justify-center px-4 lg:w-[clamp(50%_,700px_,90%)] w-full ${classname} h-1/2 !z-[999] items-center`}
      >
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
