import React from "react";
import Typed from "react-typed";
import Button from "./Button";
import Image from "next/image";
import illustrationOne from "../../../public/assets/illustrations/illustration-1.svg";
import illustrationTwo from "../../../public/assets/illustrations/illustration-2.png";
import illustrationThree from "../../../public/assets/illustrations/illustration-3.png";
import testimony from "../../../public/assets/testimonies/testmonies.png";
import ScrollAnimation from "react-animate-on-scroll";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="lg:mt-[1rem] mt-[4rem] max-w-[1300px] mx-auto lg:px-[50px] px-4 overflow-x-hidden">
      <div className="lg:flex-row flex-col-reverse flex justify-between items-center ">
        <ScrollAnimation
          animateIn="animate__fadeIn"
          animateOut="animate__fadeOut"
        >
          <div className="mt-0 lg:mt-0">
            <Typed
              strings={[`Your Choice is Visible <br/> Your Voice is Heard`]}
              typeSpeed={70}
              backSpeed={80}
              showCursor={false}
              className="font-bold lg:text-5xl text-[30px] lg:leading-[4.5rem] leading-[44px] "
            />
          </div>
          <div className="max-w-[506px] lg:text-xl text-base  mt-3 lg:mb-7 mb-5">
            <p className="tracking-[0.1px] leading-[30px]">
              Votar guarantees election, integrity and security. Enhances Voter
              engagement, saves election cordination, time, and resources
              <br /> Enter the Votar experience for free
            </p>
          </div>
          <Link href="/signin?create-account=signup">
            <Button className="bg-[#015CE9] text-white rounded-lg lg:w-[221px] lg:h-[52px] w-[180px] h-[42px] p-[14px] whitespace-nowrap">
              Start a Free Election
            </Button>
          </Link>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="animate__bounceInRight"
          animateOut="animate__bounceOutRight"
        >
          <div className="flex lg:gap-[38px] gap-0 p-10">
            <Image
              src={illustrationOne}
              width={0}
              height={0}
              alt="illustration"
              className="w-[300px] h-[300px] object-contain lg:w-full lg:h-auto"
            />
            <div className="relative tilt-inward-left  ">
              <img
                src={illustrationTwo.src}
                alt="illustration"
                className="absolute top-[-4rem] left-[-3rem]"
              />
              <img
                src={illustrationThree.src}
                alt="illustration"
                className="absolute bottom-[-3rem] right-0"
              />
              <div className="lg:w-[395px] lg:h-[395px] hidden lg:block rounded-[150px] bg-[#ccc]"></div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
      <div className="flex items-center gap-3 max-w-[450px] lg:mt-[-3.5rem] mt-7">
        <img
          src={testimony.src}
          alt="testimonies"
          className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px]"
        />
        <div>
          <p className="mb-4 lg:text-xl text-sm">
            “I never believed E- voting could be this convinient and reliable”
          </p>

          <p className="text-[#444] lg:text-base text-xs">
            Britt K. - Digital Payments Hub Product Manager
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
