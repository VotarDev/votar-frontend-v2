import React, { useEffect, useRef } from "react";
import { Collapse } from "react-collapse";
import { ChevronDown, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";

interface AccordionItemProps {
  children: React.ReactNode;
  curOpen: number | false;
  onOpen: (value: number | false) => void;
  num: number;
  title: string;
}

/** One question. Opens on click/Enter/Space; #faq-<n> links open it directly. */
const AccordionItem = ({ children, curOpen, onOpen, num, title }: AccordionItemProps) => {
  const isOpen = num === curOpen;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const faqId = `faq-${num}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/faq#${faqId}`);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  };

  // Opened from a shared link.
  useEffect(() => {
    if (window.location.hash === `#${faqId}`) {
      onOpen(num);
      window.setTimeout(
        () => itemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100,
      );
    }
  }, [faqId, num, onOpen]);

  return (
    <div
      ref={itemRef}
      id={faqId}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-xl border transition-colors",
        isOpen ? "border-[#015CE9]/30 bg-white shadow-sm" : "border-transparent bg-[#F9F9F9]",
      )}
    >
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => onOpen(isOpen ? false : num)}
          aria-expanded={isOpen}
          aria-controls={`${faqId}-answer`}
          className="flex flex-1 items-center justify-between gap-4 py-5 pl-5 text-left ssm:py-6 ssm:pl-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#015CE9]"
        >
          <h2 className="font-semibold ssm:text-[18px] lg:text-xl">{title}</h2>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-[#015CE9] transition-transform duration-300",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={copyLink}
          aria-label={`Copy a link to "${title}"`}
          title="Copy link to this question"
          className="flex shrink-0 items-center px-4 text-slate-400 transition-colors hover:text-[#015CE9] ssm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#015CE9]"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>
      <Collapse isOpened={isOpen}>
        <div
          id={`${faqId}-answer`}
          role="region"
          aria-label={title}
          className="px-5 pb-6 leading-[1.7] text-slate-700 ssm:px-8"
        >
          <p>{children}</p>
        </div>
      </Collapse>
    </div>
  );
};

export default AccordionItem;
