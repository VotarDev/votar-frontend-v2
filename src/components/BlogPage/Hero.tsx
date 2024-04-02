import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeZoomIn, elementList } from "@/utils/util";

const Hero = () => {
  return (
    <div className="lg:pt-20 lg:pb-[150px] pt-28">
      <motion.div
        variants={elementList}
        initial="initial"
        whileInView="animate"
        className="flex lg:justify-between items-center text-[#f8f8f8] lg:gap-20 gap-10 lg:flex-row flex-col justify-center text-center lg:text-left"
      >
        <motion.div variants={fadeZoomIn} custom={0}>
          <div className="bg-[rgba(204,204,204,0.2)] lg:w-[50%] w-full rounded-full text-xl py-3 flex justify-center px-2 mx-auto lg:mx-0">
            Votar Blog Series
          </div>
          <div className="">
            <div className="lg:text-4xl text-2xl font-semibold lg:my-10 my-5">
              Unleash the Power of e-Voting with Votar
            </div>
            <div className="lg:text-xl leading-[32px] text-base">
              Our lives are increasingly shifting online, so it’s logical that
              voting goes online (with multiple security measures put in place).
              Although public and national elections have yet to take advantage
              of e-voting, many private organizations have eagerly adopted
              internet voting, enabling them to take advantage of significant
              benefits
            </div>
            <div>
              <button className="flex justify-center items-center gap-2 w-[200px] h-[52px] blog-btn rounded-3xl py-2 px-4 mt-8 transition-all duration-150 ease-in mx-auto lg:mx-0">
                Read Full Blog{" "}
                <span>
                  <BsArrowRight />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={fadeZoomIn}
          custom={1}
          className="relative w-full overflow-hidden pb-[56.25%] lg:p-0 lg:overflow-visible mb-10 lg:m-0"
        >
          <div className="lg:block">
            <iframe
              src="https://www.youtube.com/embed/20bG5T7umTg"
              title="Sony 4K Demo: Another World"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="lg:w-[600px] lg:h-[400px] lg:rounded-3xl absolute top-0 left-0 w-full h-full lg:static rounded-xl"
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
