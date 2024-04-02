import React from "react";
import Nav from "@/src/components/Nav";
import Footer from "@/src/components/Footer";
import Head from "next/head";

const Custom404 = () => {
  return (
    <div>
      <Head>
        <title>Page not Found - Votar</title>
      </Head>
      <Nav />
      <div className="w-full h-[50vh] flex justify-center items-center text-center">
        <div>
          <h1 className="md:text-[60px] font-black text-[40px]">4😟4</h1>
          <div className="text-lg">
            We can&apos;t find the page you are looking for
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Custom404;
