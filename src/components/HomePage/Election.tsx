import React, { useState, useEffect } from "react";
import freeVotar from "../../../public/assets/images/free votar.svg";
import votarPro from "../../../public/assets/images/votar pro.svg";
import votarMeetings from "../../../public/assets/images/votar meetings.svg";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";
import AOS from "aos";
import "aos/dist/aos.css";

const Election = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const openVideoHandler = () => {
    setIsOpen(!isOpen);
  };
  const closeVideoHandler = () => {
    setIsOpen(!isOpen);
  };
  console.log(isOpen);

  return (
    <div className="lg:mt-[172px] mt-[60px] max-w-[1340px] mx-auto px-4">
      <div
        className="lg:text-5xl text-[30px] text-center font-semibold"
        data-aos="fade-up"
        data-aos-easing="ease-in-out"
      >
        Choose the Election that Suits you best
      </div>
      <div
        className="flex flex-col lg:flex-row justify-center lg:justify-between flex-wrap lg:mt-[62px] mt-[30px] items-center"
        data-aos="fade-up"
        data-aos-easing="ease-in-out"
        data-aos-duration="1000"
      >
        <div className="text-center">
          <div>
            <div className="lg:text-[40px] text-[#015CE9] font-semibold text-2xl pb-2">
              Free Votar
            </div>
            <div className="lg:text-xl leading-[30px] h-[120px] text-base">
              Setup and participate in <br />
              an online election or poll <br />
              for free
            </div>
          </div>
          <div className="cursor-pointer" onClick={openVideoHandler}>
            <img src={freeVotar.src} alt="votar election" />
          </div>
          {isOpen && (
            <div>
              <div className="video-modal w-full h-[100vh] fixed top-0 bottom-0 left-0 flex item-center justify-center z-[999]">
                <ModalVideo
                  channel="custom"
                  url="/assets/videos/dummy-video.mp4"
                  isOpen={isOpen}
                  // videoId="L61p2uyiMSo"
                  onClose={() => setIsOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <div>
            <div className="lg:text-[40px] text-[#015CE9] font-semibold text-2xl pb-2">
              Votar Pro
            </div>
            <div className="lg:text-xl leading-[30px] h-[120px] text-base">
              Enjoy more privacy and security
              <br /> features with Votar Pro from the
              <br />
              comfort of your couch or on site
            </div>
          </div>
          <div className="cursor-pointer">
            <img src={votarPro.src} alt="votar election" />
          </div>
        </div>

        <div className="text-center">
          <div>
            <div className="lg:text-[40px] text-[#015CE9] font-semibold text-2xl pb-2">
              Votar Meetings
            </div>
            <div className="lg:text-xl leading-[30px] h-auto text-base">
              Participate in motion votes, annual meeting
              <br /> confirmation, executive positions, Board of
              <br /> directors vote, By-laws ammendment, budget
              <br /> approval, contract reformation
            </div>
          </div>
          <div className="cursor-pointer">
            <img src={votarMeetings.src} alt="votar election" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Election;
