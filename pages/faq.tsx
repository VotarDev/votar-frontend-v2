import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React from "react";
import { faqs } from "@/utils/util";
import { useState } from "react";
import AccordionItem from "@/src/components/faqPage/AccordionItem";
import Header from "@/src/components/faqPage/Header";

const Faq = () => {
  const faq1 = faqs.slice(0, 5);
  const faq2 = faqs.slice(5);
  const [currentOpen, setCurrentOpen] = useState(false);
  const [currentOpenTwo, setCurrentOpenTwo] = useState(false);
  console.log(faq1);
  console.log(faq2);
  return (
    <div>
      <Nav />
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Header />
        <div className="flex justify-center lg:gap-10 gap-3 items-center flex-col lg:flex-row">
          <div className="max-w-[800px] mx-auto flex flex-col gap-3 lg:my-10 lg:h-[100vh] h-auto m-0">
            {faq1.map((faqs, index) => (
              <AccordionItem
                key={faqs.id}
                curOpen={currentOpen}
                onOpen={setCurrentOpen}
                num={index}
                title={faqs.title}
              >
                {faqs.desc}
              </AccordionItem>
            ))}
          </div>
          <div className="max-w-[800px] lg:my-10 mb-20 mx-auto flex flex-col gap-3 lg:h-[100vh] h-auto">
            {faq2.map((faqs, index) => (
              <AccordionItem
                key={faqs.id}
                curOpen={currentOpenTwo}
                onOpen={setCurrentOpenTwo}
                num={index}
                title={faqs.title}
              >
                {faqs.desc}
              </AccordionItem>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;
