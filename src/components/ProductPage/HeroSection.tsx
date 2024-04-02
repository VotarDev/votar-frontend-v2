import React from "react";
import { motion } from "framer-motion";
import vote from "../../../public/assets/icons/vote.svg";
import illustration from "../../../public/assets/illustrations/illustration-6.svg";
import line from "../../../public/assets/images/line.svg";
import { elementList, slideLeft, slideRight, fadeZoomIn } from "@/utils/util";

const HeroSection = () => {
  return (
    <div>
      <motion.div
        className="text-center relative h-auto px-4 lg:px-0 max-w-[1500px] mx-auto"
        variants={elementList}
        initial="initial"
        whileInView="animate"
      >
        <motion.div variants={fadeZoomIn} custom={0}>
          <div className="flex justify-center lg:mt-12 mt-[7rem] gap-[22px]">
            <div className="lg:text-[40px] font-bold text-2xl leading-[1.4]">
              Take Advantage of Our Services for Free or
              <br /> Pay for only What you use if you want more
            </div>
            <span className="self-end py-4 hidden lg:block">
              <img
                src={vote.src}
                alt="vote icon"
                className="w-[32px] h-[32px]"
              />
            </span>
          </div>
          <div className="mt-[35px] text-[#015CE9] lg:text-xl text-base">
            Conduct you election for free with free votar, enjoy wider scope of
            <br />
            opinions in the polls as all voter restrictions is removed, anyone
            <br />
            anywhere can participate.
          </div>
          <div className="lg:text-xl text-base text-[#A2A2A2] mt-4">
            We care about the younger ones, take advantage of the huge discount
            for
            <br />
            Student&apos;s with Campus Votar, enjoy all the security features we
            offer for just NGN 30 per voter.
            <br />
            Conducting an election to take your organization/firm to the next
            level is no easy task,
          </div>
          <div className="lg:text-xl text-base text-[#A2A2A2] mt-4">
            Let&apos;s help you simplify this task with our technology f<br />
            or as low as NGN 150 with ORG & Meeting Votar.
          </div>
        </motion.div>
        <motion.div custom={1}>
          <motion.div
            className="absolute top-[4rem] left-[-2.3rem] hidden lg:block"
            variants={slideLeft}
          >
            <img src={illustration.src} alt="illustration" />
          </motion.div>
          <motion.div
            className="absolute top-[2rem] right-[7rem] hidden lg:block"
            variants={slideRight}
          >
            <img src={line.src} alt="line" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
