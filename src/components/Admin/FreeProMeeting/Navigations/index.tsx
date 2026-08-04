import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Proceed to Votar Meeting Page", href: null },
  { label: "Proceed to Free Votar/ Votar Credit Page", href: "/admin/free-pro-meeting" },
  { label: "Proceed to Votar Pro Page", href: "/admin/free-pro-meeting/pro" },
];

const Navigations = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col sm:flex-row gap-1.5 bg-zinc-100 rounded-lg p-1.5 w-full">
      {tabs.map((tab) => {
        const isActive = tab.href !== null && pathname === tab.href;
        const tabClasses = `flex items-center justify-center min-h-[52px] px-4 py-2.5 rounded-md text-sm text-center leading-snug transition-colors ${
          isActive
            ? "bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] text-[#015CE9] font-semibold"
            : tab.href
            ? "text-gray-600 hover:text-gray-900 hover:bg-white/70"
            : "text-gray-400 cursor-not-allowed"
        }`;

        if (!tab.href) {
          return (
            <div key={tab.label} className={`w-full sm:flex-1 sm:min-w-0 ${tabClasses}`}>
              {tab.label}
            </div>
          );
        }

        return (
          <Link
            href={tab.href}
            key={tab.label}
            className="w-full sm:flex-1 sm:min-w-0"
          >
            <div className={tabClasses}>{tab.label}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default Navigations;
