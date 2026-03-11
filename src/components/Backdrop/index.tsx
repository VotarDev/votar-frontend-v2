import React from "react";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }: any) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.53)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      className="fixed top-0 left-0 h-screen w-full inset-0 backdrop-blur-lg flex justify-center items-center !z-10 text-center"
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
