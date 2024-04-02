import AboutHeader from "@/src/components/AboutPage/AboutHeader";
import JoinTeam from "@/src/components/AboutPage/JoinTeam";
import Organizations from "@/src/components/AboutPage/Organizations";
import OurTeam from "@/src/components/AboutPage/OurTeam";
import ThePack from "@/src/components/AboutPage/ThePack";
import Chat from "@/src/components/Chat";
import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React from "react";

const About = () => {
  return (
    <>
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Nav />
        <AboutHeader />
        <ThePack />
      </div>
      <Organizations />
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <OurTeam />
        <JoinTeam />
      </div>
      <Footer />
      <Chat />
    </>
  );
};

export default About;
