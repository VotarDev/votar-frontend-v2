import React from "react";
import logo from "../../public/assets/logos/logo_white.png";
import { BiRightArrowAlt } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="bg-footer-bg bg-cover w-full bg-no-repeat bg-[#00122F] text-white lg:px-[50px] px-4">
      <div className="flex flex-col lg:flex-row justify-between max-w-[1340px] mx-auto pt-[45px] lg:pb-[100px] pb-[60px]">
        <div>
          <Image
            src={logo}
            alt="logo"
            width={351}
            height={351}
            className="object-contain mt-[-8.7rem] ml-[-7rem]"
          />
          <div className="mt-[-9rem] leading-[30px] mb-[9rem] lg:mb-0">
            <p>
              We provide you with the best options for your election,
              <br />
              all our features are carefully crafted
              <br /> to give our users a seamless election journey.
            </p>
          </div>
        </div>
        <div className="lg:text-xl tex-base mt-[-7rem] lg:mt-0">
          <div className="footer-link flex items-center lg:gap-[28.31px] gap-4 mb-6">
            <span className="w-[38px] h-[38px] bg-white flex items-center justify-center text-black text-2xl rounded-[50%] ">
              <BiRightArrowAlt />
            </span>
            <Link href="/about">
              <p>About Us</p>
            </Link>
          </div>
          <div className="footer-link flex items-center lg:gap-[28.31px] gap-4 mb-6">
            <span className="w-[38px] h-[38px] bg-white flex items-center justify-center text-black text-2xl rounded-[50%]">
              <BiRightArrowAlt />
            </span>
            <Link href="/product">
              <p>Votar Plans</p>
            </Link>
          </div>
          <div className="footer-link flex items-center lg:gap-[28.31px] gap-4">
            <span className="w-[38px] h-[38px] bg-white flex items-center justify-center text-black text-2xl rounded-[50%]">
              <BiRightArrowAlt />
            </span>
            <p> Contact Us</p>
          </div>
        </div>
        <div className="lg:text-xl text-base my-7 lg:my-0">
          <div className="lg:mb-6 mb-4 font-bold lg:text-2xl text-xl">
            <h2>Locations</h2>
          </div>
          <div className="mb-3 flex gap-3">
            <span className="text-3xl">
              <CiLocationOn />
            </span>
            <div>
              <p>
                No 20 Fair-view estate
                <br />
                Lagos Island, Lagos state.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-3xl">
              <CiLocationOn />
            </span>
            <div>
              <p>
                No 1, Ooni crownland estate
                <br />
                Damico, Ile-Ife, Osun state.
              </p>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-col flex-row gap-4 lg:gap-0">
          <Link href="#">
            <div className="mb-4 text-4xl">
              <FaLinkedin />
            </div>
          </Link>
          <Link href="https://x.com/votarhq?s=21" target="_blank">
            <div className="mb-4 text-4xl">
              <FaXTwitter />
            </div>
          </Link>

          <Link
            href="https://www.instagram.com/votarhq?igsh=MWZydTF3MHJ1aDJiNg%3D%3D&utm_source=qr"
            target="_blank"
          >
            <div className="mb-4 text-4xl">
              <FaInstagram />
            </div>
          </Link>

          <Link
            href="https://www.facebook.com/profile.php?id=61553214208461&mibextid=LQQJ4d"
            target="_blank"
          >
            <div className="text-4xl text-center">
              <FaFacebook />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-between items-center lg:text-xl text-sm max-w-[1340px] mx-auto pb-6">
        <div>
          <span className="lg:pr-3 pr-1">&copy;</span>Konzi tech
        </div>
        <div className="flex items-center lg:gap-[67px] gap-8">
          <div>
            <p>Privacy Policy</p>
          </div>
          <div>
            <p>Terms and Conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
