import React from "react";
import arrow from "../../../public/assets/icons/arrow-icon.svg";
import { logos2 } from "@/utils/util";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { fadeInAnimation } from "@/utils/util";

const Organizations = () => {
  return (
    <div className="mt-[5rem] organization lg:py-[5rem] py-[2rem] xl:px-10">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0">
        <div className="lg:text-[40px] text-[1.5rem] max-w-[40rem] relative font-semibold">
          <h1>
            A few <span className="text-[#015CE9]">Global Organizations </span>
            that trust Votar
          </h1>
          <span className="absolute bottom-[1rem] right-[22rem] hidden lg:block">
            <img src={arrow.src} alt="arrow icon" />
          </span>
        </div>

        <div className="lg:flex flex-wrap text-center justify-center gap-10 mt-[3rem] pb-[5rem] hidden">
          {logos2.map((logos, index) => (
            <motion.div
              key={logos.id}
              className="logo-card w-[10rem] flex justify-center items-center py-4"
              variants={fadeInAnimation}
              initial="initial"
              whileInView="animate"
              custom={index}
            >
              <img
                src={logos.image}
                alt="logos"
                className="w-[80px] h-[80px] object-contain"
              />
            </motion.div>
          ))}
        </div>

        <div className="lg:hidden mt-[2rem]">
          <Swiper
            slidesPerView={3.5}
            freeMode={true}
            modules={[Autoplay, A11y]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              240: { slidesPerView: 3, spaceBetween: 30 },
              624: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 3.5, spaceBetween: 40 },
            }}
            centeredSlides={true}
            spaceBetween={30}
            loop={true}
            className=" overflow-hidden flex items-center w-full "
          >
            {logos2.map((logo) => (
              <SwiperSlide key={logo.id}>
                <img
                  src={logo.image}
                  alt="logo"
                  className="w-[80px] h-[80px] object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
