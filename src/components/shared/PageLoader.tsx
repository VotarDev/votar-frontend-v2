import React from "react";
import Image from "next/image";
import logo from "@/public/assets/logos/votar-logo.svg";
import { cn } from "@/utils/cn";

interface PageLoaderProps {
  /** Short line under the logo. */
  message?: string;
  /** Fill the whole screen (default) or just the space it's given. */
  fullScreen?: boolean;
  className?: string;
}

/** The Votar logo, gently floating, with a short message. */
const PageLoader = ({
  message = "Getting things ready",
  fullScreen = true,
  className,
}: PageLoaderProps) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "flex w-full flex-col items-center justify-center gap-6 px-4",
      fullScreen ? "min-h-screen bg-slate-50" : "py-24",
      className,
    )}
  >
    <div className="flex animate-loader-fade-in flex-col items-center gap-6">
      <div className="motion-safe:animate-loader-float">
        <Image src={logo} alt="" width={120} priority />
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {message}
          <span className="inline-flex w-5 justify-start" aria-hidden="true">
            <span className="motion-safe:animate-pulse">.</span>
            <span
              className="motion-safe:animate-pulse"
              style={{ animationDelay: "200ms" }}
            >
              .
            </span>
            <span
              className="motion-safe:animate-pulse"
              style={{ animationDelay: "400ms" }}
            >
              .
            </span>
          </span>
        </p>
      </div>
    </div>
    <span className="sr-only">Loading</span>
  </div>
);

export default PageLoader;
