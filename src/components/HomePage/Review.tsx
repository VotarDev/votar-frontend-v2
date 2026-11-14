import React from "react";
import Reveal from "./Reveal";

const Review = () => {
  return (
    <div
      className="bg-review-bg w-full bg-no-repeat bg-cover mt-[130px]  py-[90px] lg:px-[50px] px-4"
    >
      <Reveal className=" text-white leading-[30px] max-w-[1300px] mx-auto">
        <div className="lg:text-xl text-base">
          <p>
            “After years of using other products and methods of voting, we found
            Votar.
            <br />
            Setting up the election was very intuitive, and the email and text
            message feature
            <br /> to communicate with voters was very amazing as it got us 85%
            <br /> voter turnout in our election”
          </p>
        </div>
        <div className="text-[#F3F3F3] pt-[15px]">
          <p> Max - Medical Students Association</p>
        </div>
      </Reveal>
    </div>
  );
};

export default Review;
