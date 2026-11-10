import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selected_plan } from "@/redux/features/votarPlan/votarPlanSlice";
import { cn } from "@/utils/cn";

// Votar Meeting can't be chosen here yet (it was disabled in the old radio group too).
const PLANS = [
  { value: "Free Votar", disabled: false },
  { value: "Votar Pro", disabled: false },
  { value: "Votar Meeting", disabled: true },
];

/**
 * Switch the election type from inside the form. Saves the plan the same way
 * the plan page does (localStorage + Redux), which also updates the steps.
 */
const PlanSelector = () => {
  const dispatch = useDispatch();
  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  const choose = (plan: string) => {
    localStorage.setItem("votar plan", JSON.stringify(plan));
    dispatch(selected_plan(plan));
  };

  return (
    <div
      role="radiogroup"
      aria-label="Election type"
      className="grid grid-cols-1 gap-2 rounded-lg bg-muted p-1 ssm:grid-cols-3"
    >
      {PLANS.map((plan) => {
        const isSelected = votarPlan === plan.value;
        return (
          <button
            key={plan.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={plan.disabled}
            onClick={() => choose(plan.value)}
            className={cn(
              "h-10 rounded-md px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              isSelected
                ? "bg-surface text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {plan.value}
          </button>
        );
      })}
    </div>
  );
};

export default PlanSelector;
