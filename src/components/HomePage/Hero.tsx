import React from "react";
import Typed from "react-typed";
import Button from "./Button";
import Image from "next/image";
import illustrationOne from "../../../public/assets/illustrations/illustration-1.svg";
import illustrationTwo from "../../../public/assets/illustrations/illustration-2.png";
import illustrationThree from "../../../public/assets/illustrations/illustration-3.png";
import testimony from "../../../public/assets/testimonies/testmonies.png";
import Reveal from "./Reveal";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { useReducedMotion } from "framer-motion";

const HERO_PHOTOS = [
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
];

const Hero = () => {
  // Keep the photo rows still for people who prefer reduced motion.
  const reduceMotion = useReducedMotion();
  return (
    <div className="lg:mt-[1rem]  mt-[4rem]   px-4 overflow-hidden">
      <div className="lg:flex-row flex-col-reverse flex justify-between items-center w-full text-center lg:text-left max-w-[1300px] lg:px-[50px] mx-auto">
        <Reveal onLoad>
          <div className="mt-0 lg:mt-0">
            {/* <Typed
              strings={[`Your Choice is Visible <br/> Your Voice is Heard`]}
              typeSpeed={70}
              backSpeed={80}
              showCursor={false}
              className="font-bold lg:text-5xl text-[20px] lg:leading-[4.5rem] leading-[44px] "
            /> */}
            <h1 className="font-bold lg:text-5xl text-[28px] lg:leading-[4.5rem] leading-[36px] ">
              <Typed
                strings={[
                  "Better Visibility For You...",
                  "Your Voice Matters...",
                  "Trusted By Many...",
                ]}
                typeSpeed={70}
                backSpeed={80}
                loop
                showCursor={true}
              />
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
        </Reveal>
        <Reveal onLoad from="right" delay={0.15}>
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
        </Reveal>
      </div>

      {/* Photos from elections run on Votar, scrolling in two rows. */}
      <section
        aria-labelledby="votar-in-action"
        className="-mx-4 mt-12 overflow-hidden py-10 lg:mt-16 lg:py-14"
      >
        <Reveal className="mx-auto mb-8 max-w-2xl px-4 text-center lg:mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#015CE9]">
            Votar in action
          </p>
          <h2
            id="votar-in-action"
            className="mt-2 text-2xl font-bold leading-tight text-slate-900 lg:text-4xl"
          >
            Trusted at real elections
          </h2>
          <p className="mt-3 text-base text-slate-600 lg:text-lg">
            Organisations use Votar to run transparent elections and watch the results come in live.
          </p>
        </Reveal>

        <div className="space-y-4 lg:space-y-6">
          {[HERO_PHOTOS.slice(0, 7), HERO_PHOTOS.slice(7)].map((row, rowIndex) => (
            <Marquee
              key={rowIndex}
              pauseOnHover
              play={!reduceMotion}
              speed={rowIndex === 0 ? 40 : 32}
              direction={rowIndex === 0 ? "left" : "right"}
              gradient
              gradientColor="white"
              gradientWidth={80}
              autoFill
            >
              {row.map((src, index) => (
                <figure
                  key={src}
                  className="group mx-2 overflow-hidden rounded-2xl bg-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/5 lg:mx-3"
                >
                  <Image
                    src={src}
                    alt={`An election run on Votar (photo ${rowIndex * 7 + index + 1})`}
                    width={360}
                    height={240}
                    sizes="(min-width: 998px) 320px, 240px"
                    className="h-[160px] w-[240px] object-cover transition-transform duration-500 group-hover:scale-105 lg:h-[220px] lg:w-[320px]"
                  />
                </figure>
              ))}
            </Marquee>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
