import React, { useMemo, useState } from "react";
import Head from "next/head";
import { Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import { faqs } from "@/utils/util";
import AccordionItem from "@/src/components/faqPage/AccordionItem";
import Header from "@/src/components/faqPage/Header";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | false>(false);
  const [search, setSearch] = useState("");

  // Keep each question's original number so shared #faq-<n> links still work.
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return faqs
      .map((faq, index) => ({ faq, index }))
      .filter(
        ({ faq }) =>
          !query ||
          faq.title.toLowerCase().includes(query) ||
          faq.desc.toLowerCase().includes(query),
      );
  }, [search]);

  // Lets search engines show these answers directly in results.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: { "@type": "Answer", text: faq.desc },
    })),
  };

  return (
    <div>
      <Head>
        <script
          key="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-16 lg:pb-24">
        <Header />

        <div className="relative mx-auto mt-8 max-w-xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions"
            aria-label="Search frequently asked questions"
            className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-base outline-none transition-shadow placeholder:text-slate-400 focus:border-[#015CE9] focus:ring-4 focus:ring-[#015CE9]/10"
          />
        </div>

        <div className="mt-8 space-y-3 lg:mt-10">
          {visible.length === 0 ? (
            <p className="rounded-xl bg-[#F9F9F9] px-6 py-10 text-center text-slate-600">
              No questions match “{search.trim()}”. Try another word, or chat with us below.
            </p>
          ) : (
            visible.map(({ faq, index }) => (
              <AccordionItem
                key={faq.id}
                curOpen={openIndex}
                onOpen={setOpenIndex}
                num={index}
                title={faq.title}
              >
                {faq.desc}
              </AccordionItem>
            ))
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl bg-[#015CE9]/5 px-6 py-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">Still have questions?</h2>
          <p className="text-slate-600">Our team is happy to help.</p>
          <a
            href="https://wa.me/2348144092733"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 font-semibold text-white transition-colors hover:bg-[#1ebe5a]"
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
            Chat with us on WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faq;
