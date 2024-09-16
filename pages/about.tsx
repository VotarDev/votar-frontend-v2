import AboutHeader from "@/src/components/AboutPage/AboutHeader";
import JoinTeam from "@/src/components/AboutPage/JoinTeam";
import Organizations from "@/src/components/AboutPage/Organizations";
import OurTeam from "@/src/components/AboutPage/OurTeam";
import ThePack from "@/src/components/AboutPage/ThePack";
import Chat from "@/src/components/Chat";
import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React from "react";
import Head from "next/head";

const About = () => {
  return (
    <>
      <Head>
        <title>About Us - Votar</title>
        <meta
          name="description"
          content="Learn more about Votar and how we help people make informed voting decisions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="About Us - Votar" />
        <meta
          property="og:description"
          content="Discover the mission behind Votar and how we empower voters."
        />
        <meta property="og:url" content="https://www.votar.ng/about" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/about" />
      </Head>
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
