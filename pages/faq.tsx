import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import React from "react";
import { faqs } from "@/utils/util";
import { useState } from "react";
import AccordionItem from "@/src/components/faqPage/AccordionItem";
import Header from "@/src/components/faqPage/Header";
import Head from "next/head";

const Faq = () => {
  const faq1 = faqs.slice(0, 5);
  const faq2 = faqs.slice(5);
  const [currentOpen, setCurrentOpen] = useState(false);
  const [currentOpenTwo, setCurrentOpenTwo] = useState(false);

  return (
    <div>
      <Head>
        <title>FAQ - Votar</title>
        <meta
          name="description"
          content="Find answers to common questions about Votar. Get all the information you need about voting and using the platform."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="FAQ - Votar" />
        <meta
          property="og:description"
          content="Common questions and answers about voting with Votar."
        />
        <meta property="og:url" content="https://www.votar.ng/faq" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/faq" />
      </Head>
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
