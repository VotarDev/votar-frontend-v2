import React, { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";

interface MonitoringCardProps {
  title: string;
  description: string;
  url: string;
  icon: React.ElementType;
  /** Classes for the icon tile, e.g. "bg-secondary text-primary". */
  tone?: string;
}

/** A shareable monitoring link with copy and open actions. */
export default function MonitoringCard({
  title,
  description,
  url,
  icon: Icon,
  tone = "bg-secondary text-primary",
}: MonitoringCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tone
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border bg-muted/50 px-3 py-2.5 font-mono text-xs text-slate-700 break-all">
        {url}
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant={copied ? "secondary" : "outline"}
          onClick={copy}
          className="flex-1"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button asChild variant="ghost" className="shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink /> Open
          </a>
        </Button>
      </div>
    </Card>
  );
}
