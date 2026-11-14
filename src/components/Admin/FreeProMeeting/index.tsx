import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import PlanSwitcher from "./PlanSwitcher";
import OrganisersTable from "./OrganisersTable";
import CreditsTable from "./CreditsTable";
import PageHeader from "@/src/components/shared/PageHeader";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "organisers", label: "Free Votar organisers" },
  { id: "credits", label: "Votar credits" },
] as const;

/** Free Votar organisers and everyone's Votar credit balances. */
const FreeProMeeting = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("organisers");
  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PageHeader
          title="Free Votar & credits"
          description="Organisers running Free Votar elections, and Votar credit top-ups."
        />
        <PlanSwitcher />
        <Card className="overflow-hidden">
          <div className="border-b border-border p-4 pb-0">
            <div role="tablist" aria-label="Free Votar" className="flex gap-4">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
                    tab === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {tab === "organisers" ? <OrganisersTable plan="free-votar" /> : <CreditsTable />}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FreeProMeeting;
