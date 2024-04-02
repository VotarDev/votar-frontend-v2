import React from "react";
import Nav from "@/src/components/Nav";
import Hero from "@/src/components/BlogPage/Hero";
import Card from "@/src/components/BlogPage/Card";
import Posts from "@/src/components/BlogPage/Posts";
import Footer from "@/src/components/Footer";
import Chat from "@/src/components/Chat";

const Blog = () => {
  return (
    <>
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
