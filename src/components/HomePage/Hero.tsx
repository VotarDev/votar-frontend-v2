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
import Marquee from "react-fast-marquee";

const Hero = () => {
  return (
    <div className="lg:mt-[1rem]  mt-[4rem]   px-4 overflow-hidden">
      <div className="lg:flex-row flex-col-reverse flex justify-between items-center w-full text-center lg:text-left max-w-[1300px] lg:px-[50px] mx-auto">
        <ScrollAnimation
          animateIn="animate__fadeIn"
          animateOut="animate__fadeOut"
        >
          <div className="mt-0 lg:mt-0">
            {/* <Typed
              strings={[`Your Choice is Visible <br/> Your Voice is Heard`]}
              typeSpeed={70}
              backSpeed={80}
              showCursor={false}
              className="font-bold lg:text-5xl text-[20px] lg:leading-[4.5rem] leading-[44px] "
            /> */}
            <h1 className="font-bold lg:text-5xl text-[28px] lg:leading-[4.5rem] leading-[36px] ">
              Better Visibility For You...
            </h1>
          </div>
          <div className="max-w-[506px] lg:text-xl text-base  mt-3 lg:mb-7 mb-5">
            {/* <p className="tracking-[0.1px] leading-[30px]">
              Votar guarantees election, integrity and security. Enhances Voter
              engagement, saves election cordination, time, and resources
              <br /> Enter the Votar experience for free
            </p> */}
            <p className="max-w-[506px] lg:text-xl text-base mt-3 lg:mb-7 mb-5 leading-[40px]">
              Making elections and choice visualization simple, convenient,
              trusted, and reliable for you! Whoever you are or wherever you
              are.
              <br />
              Enjoy the Votar experience!...
            </p>
          </div>
          <div className="flex justify-center lg:block">
            <Link href="/signin?create-account=signup">
              <Button className="bg-[#015CE9] text-white rounded-lg lg:w-[221px] lg:h-[52px] w-[180px] h-[42px] p-[14px] whitespace-nowrap">
                Start a Free Election
              </Button>
            </Link>
          </div>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="animate__bounceInRight"
          animateOut="animate__bounceOutRight"
        >
          <div className="flex lg:gap-[38px] gap-0 lg:p-10 p-6">
            <Image
              src={illustrationOne}
              width={300}
              height={300}
              alt="illustration"
              className="w-[200px] h-[200px] object-contain lg:w-full lg:h-auto"
            />
            <div className="relative tilt-inward-left hidden lg:block">
              <div className="absolute top-[-4rem] left-[-3rem]">
                <Image
                  src={illustrationTwo.src}
                  alt="illustration"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="absolute bottom-[-3rem] right-0">
                <Image
                  src={illustrationThree.src}
                  alt="illustration"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="lg:w-[395px] lg:h-[395px] hidden lg:block ">
                <video
                  src="/assets/videos/Home screen video.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-[395px] h-[395px] object-contain"
                ></video>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>

      <div className="w-full overflow-hidden pt-10 relative">
        <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <Marquee
          pauseOnHover
          speed={100}
          gradientColor="white"
          gradientWidth={200}
        >
          <div className="flex w-full">
            {[
              "/assets/images/hero-image1.jpeg",
              "/assets/images/hero-image2.jpeg",
              "/assets/images/hero-image3.jpeg",
              "/assets/images/hero-image4.jpeg",
              "/assets/images/hero-image-5.jpeg",
              "/assets/images/hero-image6.jpeg",
              "/assets/images/hero-image7.jpeg",
              "/assets/images/hero-image8.jpeg",
              "/assets/images/hero-image9.jpeg",
              "/assets/images/hero-image10.jpeg",
              "/assets/images/hero-image11.jpeg",
              "/assets/images/hero-image12.jpeg",
              "/assets/images/hero-image13.jpeg",
            ].map((src, index) => (
              <div
                key={index}
                className=" flex justify-center items-center px-4 "
              >
                <Image
                  src={src}
                  alt={`logo-${index + 1}`}
                  width={300}
                  height={200}
                  className="h-[200px] w-[250px] object-cover rounded-lg border-2 border-[#25D366]"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>

      {/* <div className="flex items-center   gap-3 max-w-[450px] mx-auto lg:mx-0  mt-7">
        <Image
          src={testimony.src}
          alt="testimonies"
          width={60}
          height={60}
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
      </div> */}
    </div>
  );
};

export default Hero;
