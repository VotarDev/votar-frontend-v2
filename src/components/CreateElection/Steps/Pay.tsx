import React from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa6";
import { Copy, CreditCard, MessageSquareText, Phone } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

const PHONE_NUMBER = "08144092733";
const WHATSAPP_URL = "https://wa.me/2348144092733";

const ContactOption = ({
  href,
  icon: Icon,
  title,
  description,
  tone,
  external,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  tone: string;
  external?: boolean;
}) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer" : undefined}
    className="group flex items-start gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/40 hover:bg-secondary/30"
  >
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-foreground">{title}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
    </span>
  </a>
);

/**
 * Payment is arranged with the Votar team, so this step only shows how to
 * reach them. Used by both the create and the edit election flows.
 */
const Pay = () => {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      toast.success("Phone number copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Copy operation failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="p-6 text-center smm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <CreditCard className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Complete your payment
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Thank you for choosing Votar. Your use of our platform reflects your
          commitment to transparency and innovation. We&apos;d like to have a
          quick chat with you and share the payment details for the purchase of
          your Votar credits.
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground">Contact our payment team</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          WhatsApp is the quickest way to reach us.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <ContactOption
            href={WHATSAPP_URL}
            external
            icon={FaWhatsapp}
            title="WhatsApp"
            description="Chat with our payment specialist"
            tone="bg-green-50 text-green-600"
          />
          <ContactOption
            href={`tel:${PHONE_NUMBER}`}
            icon={Phone}
            title="Voice call"
            description="Speak directly with our payment team"
            tone="bg-secondary text-primary"
          />
          <ContactOption
            href={`sms:${PHONE_NUMBER}`}
            icon={MessageSquareText}
            title="Text message"
            description="Send us your payment inquiry"
            tone="bg-amber-50 text-amber-600"
          />
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-lg bg-muted/60 p-4 smm:flex-row">
          <div className="text-center smm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Phone number
            </p>
            <p className="font-mono text-xl font-semibold text-foreground">
              {PHONE_NUMBER}
            </p>
          </div>
          <Button variant="outline" onClick={handleCopyClick}>
            <Copy /> Copy number
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Pay;
