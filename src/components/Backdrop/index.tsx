import React from "react";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }: any) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 h-screen w-full bg-[rgba(0_,0_,0_,0.53)] inset-0 backdrop-blur-lg flex justify-center items-center !z-[9999] text-center"
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
