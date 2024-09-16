import React from "react";
import Nav from "@/src/components/Nav";
import HeroSection from "@/src/components/ProductPage/HeroSection";
import Plan from "@/src/components/ProductPage/Plan";
import Chat from "@/src/components/Chat";
import PaymentPlan from "@/src/components/ProductPage/PaymentPlan";
import Footer from "@/src/components/Footer";
import TryPlan from "@/src/components/ProductPage/TryPlan";
import Head from "next/head";

const Product = () => {
  return (
    <div>
      <Head>
        <title>Products & Plans - Votar</title>
        <meta
          name="description"
          content="Take advantage of our services for free or pay for only what you use if you want more. Choose a plan that suits your needs."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Products & Plans - Votar" />
        <meta
          property="og:description"
          content="Choose a plan that suits your needs. Take advantage of our services for free or pay for only what you use if you want more."
        />
        <meta property="og:url" content="https://www.votar.ng/product" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/product" />
      </Head>
      <Nav />
      <HeroSection />
      <Plan />
      <PaymentPlan />
      <TryPlan />
      <Chat />
      <Footer />
    </div>
  );
};

export default Product;
