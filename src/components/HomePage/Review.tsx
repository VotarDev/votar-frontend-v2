import React, { useEffect } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import AOS from "aos";
import "aos/dist/aos.css";

const Review = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      className="bg-review-bg w-full bg-no-repeat bg-cover mt-[130px] pt-[82px] pb-[90px] lg:px-[50px] px-4"
      data-aos="fade-up"
      data-aos-easing="ease-in-out"
      data-aos-duration="1000"
    >
      <div className=" text-white leading-[30px] max-w-[1300px] mx-auto">
        <div className="lg:text-xl text-base">
          “After years of using other products and methods of voting, we found
          Votar.
          <br />
          Setting up the election was very intuitive, and the email and text
          message feature
          <br /> to communicate with voters was very amazing as it got us 85%
          <br /> voter turnout in our election”
        </div>
        <div className="text-[#F3F3F3] pt-[15px]">
          Max - Medical Students Association
        </div>
      </div>
    </div>
  );
};

export default Review;
