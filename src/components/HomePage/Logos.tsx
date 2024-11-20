import React from "react";
import { logos } from "@/utils/util";
import ScrollAnimation from "react-animate-on-scroll";
import "animate.css/animate.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import Image from "next/image";

const Logos = () => {
  return (
    <div className="mt-[65px] max-w-[1300px] mx-auto px-4 ">
      <ScrollAnimation
        animateIn="animate__fadeIn"
        animateOut="animate__fadeOut"
      >
        <div className="lg:px-[25px] lg:text-[24px] mb-4 text-[18px] px-4">
          <p>Join our list of trusted clients</p>
        </div>
        <div className="lg:flex justify-between items-center flex-wrap hidden">
          {logos.map((logo) => (
            <div key={logo.id}>
              <div key={logo.id} className="relative w-[120px] h-[85px]">
                <Image
                  src={logo.image}
                  alt="logo"
                  fill
                  sizes="100%"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:hidden px-4">
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
            {logos.map((logo) => (
              <SwiperSlide key={logo.id}>
                <div key={logo.id} className="relative w-[120px] h-[85px]">
                  <Image
                    src={logo.image}
                    alt="logo"
                    fill
                    sizes="100%"
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div>
          <h2 className="lg:text-2xl text-center max-w-[759px] mx-auto mt-14 font-semibold text-[18px] ">
            Votar is used by all Industries and professional association that
            are in need of a credible and reliable voting process
          </h2>
        </div>
        <div className="flex flex-wrap md:flex-row flex-col text-center md:text-left justify-center gap-[62px] mt-[52px] lg:text-xl text-[#013D9B] text-base">
          <div>
            <div className="pb-4">
              <p>Professional Association</p>
            </div>
            <div className="pb-4">
              <p>Industry Association</p>
            </div>
            <div className="pb-4">
              <p>NGO’s, Society and Clubs</p>
            </div>
            <div>
              <p>Fashion Shows and Events</p>
            </div>
          </div>
          <div>
            <div className="pb-4">
              <p>University Unions</p>
            </div>
            <div className="pb-4">
              <p>University Association</p>
            </div>
            <div className="pb-4">
              <p>Churches and religious groups</p>
            </div>
            <div>
              <p>Award Shows</p>
            </div>
          </div>
          <div>
            <div className="pb-4">
              <p>Political Parties</p>
            </div>
            <div className="pb-4">
              <p>Government Election</p>
            </div>
            <div className="pb-4">
              <p>Cooperatives and credit unions</p>
            </div>
            <div className="pb-4">
              <p>Other companies and organization</p>
            </div>
            <div>
              <p>Pageantry Events</p>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Logos;
