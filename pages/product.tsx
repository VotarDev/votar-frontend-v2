import React from "react";
import Nav from "@/src/components/Nav";
import HeroSection from "@/src/components/ProductPage/HeroSection";
import Plan from "@/src/components/ProductPage/Plan";
import Chat from "@/src/components/Chat";
import PaymentPlan from "@/src/components/ProductPage/PaymentPlan";
import Footer from "@/src/components/Footer";
import TryPlan from "@/src/components/ProductPage/TryPlan";

const Product = () => {
  return (
    <div>
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
