import React from "react";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }: any) => {
  return (
    <motion.div
      onClick={onClick}
      // Fade the whole layer, so the tint and the blur appear and disappear
      // together (animating only the colour left the blur behind on close).
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-0 left-0 h-screen w-full inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center !z-10 text-center"
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
