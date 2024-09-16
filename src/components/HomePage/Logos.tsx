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
          Join our list of trusted clients
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
          <p className="lg:text-2xl text-center max-w-[759px] mx-auto mt-14 font-semibold text-[18px] ">
            Votar is used by all Industries and professional association that
            are in need of a credible and reliable voting process
          </p>
        </div>
        <div className="flex flex-wrap md:flex-row flex-col text-center md:text-left justify-center gap-[62px] mt-[52px] lg:text-xl text-[#013D9B] text-base">
          <div>
            <div className="pb-4">Professional Association</div>
            <div className="pb-4">Industry Association</div>
            <div className="pb-4">NGO’s, Society and Clubs</div>
            <div>Fashion Shows and Events</div>
          </div>
          <div>
            <div className="pb-4">University Unions</div>
            <div className="pb-4">University Association</div>
            <div className="pb-4">Churches and religious groups</div>
            <div>Award Shows</div>
          </div>
          <div>
            <div className="pb-4">Political Parties</div>
            <div className="pb-4">Government Election</div>
            <div className="pb-4">Cooperatives and credit unions</div>
            <div className="pb-4">Other companies and organization</div>
            <div>Pageantry Events</div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Logos;
