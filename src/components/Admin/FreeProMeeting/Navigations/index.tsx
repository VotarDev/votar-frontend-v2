import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigations = () => {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex items-center gap-8">
        <div className="w-40 h-14 p-3 bg-zinc-100 rounded-lg shadow border border-neutral-400 flex items-center justify-center text-center text-sm pointer-events-none">
          Proceed to Votar Meeting Page
        </div>
        <Link href="/admin/free-pro-meeting">
          <div
            className={`w-[167px] h-14 p-3 bg-zinc-100 rounded-lg shadow border border-neutral-400 flex items-center justify-center text-center text-sm ${
              pathname === "/admin/free-pro-meeting"
                ? "shadow-[0px_4px_19px_0px_rgba(0_,0_,0_,0.2)] scale-[1.1]"
                : ""
            }`}
          >
            Proceed to Free Votar/ Votar Credit Page
          </div>
        </Link>
        <Link href="/admin/free-pro-meeting/pro">
          <div
            className={`w-40 h-14 p-3 bg-zinc-100 rounded-lg shadow border border-neutral-400 flex items-center justify-center text-center text-sm ${
              pathname === "/admin/free-pro-meeting/pro"
                ? "shadow-[0px_4px_19px_0px_rgba(0_,0_,0_,0.2)] scale-[1.1]"
                : ""
            }`}
          >
            Proceed to Votar Pro Page
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navigations;
