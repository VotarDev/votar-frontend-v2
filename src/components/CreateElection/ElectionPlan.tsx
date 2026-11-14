import React from "react";
import { electionPlans } from "@/utils/util";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { selected_plan } from "@/redux/features/votarPlan/votarPlanSlice";
import { FaYoutube } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import PageHeader from "@/src/components/shared/PageHeader";
import { clearElectionDraft } from "@/utils/electionDraft";
import ResumeElectionCard from "./ResumeElectionCard";

const ElectionPlan = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Without a plan (e.g. an older draft), the flow keeps the plan already saved.
  const openCreateFlow = (plan?: string) => {
    if (plan) {
      localStorage.setItem("votar plan", JSON.stringify(plan));
      dispatch(selected_plan(plan));
    }
    router.push("/create-election/create");
  };

  // Choosing a plan starts a brand-new election.
  const handlePlan = (plan: string) => {
    clearElectionDraft();
    openCreateFlow(plan);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2 lg:space-y-8">
      <PageHeader
        title="Create an election"
        description="Choose the type of election you want to run."
      />

      <ResumeElectionCard onResume={openCreateFlow} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {electionPlans.map((plan) => (
          <Card
            key={plan.id}
            className="group flex flex-col p-5 transition-shadow hover:border-primary/40 hover:shadow-md lg:p-6"
          >
            <span className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {plan.plan}
            </span>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {plan.desc}
            </p>
            <a
              href={plan.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[#FF0000] hover:underline"
            >
              <FaYoutube className="text-base" />
              Watch how it works
            </a>
            <Button
              className="mt-5 w-full"
              onClick={() => handlePlan(plan.plan)}
            >
              {plan.btnText} <ArrowRight />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElectionPlan;
