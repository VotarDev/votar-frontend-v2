import React from "react";
import Nav from "@/src/components/Nav";
import Hero from "@/src/components/BlogPage/Hero";
import Card from "@/src/components/BlogPage/Card";
import Posts from "@/src/components/BlogPage/Posts";
import Footer from "@/src/components/Footer";
import Chat from "@/src/components/Chat";
import Head from "next/head";

const Blog = () => {
  return (
    <>
      <Head>
        <title>Blog - Votar</title>
        <meta
          name="description"
          content="Unleash the power of e-Voting with votar. Get the latest news, updates, and insights on voting and election"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Blog - Votar" />
        <meta
          property="og:description"
          content="Discover the mission behind Votar and how we empower voters."
        />
        <meta property="og:url" content="https://www.votar.ng/blog" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/blog" />
      </Head>
      <div className=" bg-[#015CE9]">
        <Nav />
        <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
          <Hero />
        </div>
      </div>
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Card />
      </div>
      <div>
        <Posts />
        <Chat />
        <Footer />
      </div>
    </>
  );
};

export default Blog;
