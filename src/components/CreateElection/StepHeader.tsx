import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { getStepLabel } from "./steps";

interface StepHeaderProps {
  steps: string[];
  /** 1-based. */
  currentStep: number;
  /** The furthest step reached (1-based); steps up to it can be revisited. */
  furthestStep: number;
  onStepChange: (step: number) => void;
}

const StepHeader = ({
  steps,
  currentStep,
  furthestStep,
  onStepChange,
}: StepHeaderProps) => {
  const current = Math.min(Math.max(currentStep, 1), steps.length);

  return (
    <nav aria-label="Election setup progress">
      {/* Phones: compact progress */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-foreground">
            {getStepLabel(steps[current - 1])}
          </span>
          <span className="text-muted-foreground">
            Step {current} of {steps.length}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const reachable =
              stepNumber <= furthestStep && stepNumber !== current;
            return (
              <button
                key={step}
                type="button"
                disabled={!reachable}
                onClick={() => onStepChange(stepNumber)}
                aria-label={`${getStepLabel(step)}${
                  stepNumber === current ? " (current step)" : ""
                }`}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors disabled:cursor-default disabled:opacity-100",
                  stepNumber <= current ? "bg-primary" : "bg-slate-200",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Wider screens: numbered steps */}
      <ol className="hidden items-center md:flex">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === current;
          const isComplete = stepNumber < current;
          const reachable = stepNumber <= furthestStep && !isCurrent;
          return (
            <li
              key={step}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1",
              )}
            >
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onStepChange(stepNumber)}
                aria-current={isCurrent ? "step" : undefined}
                className="group flex items-center gap-2.5 rounded-md py-1 pr-2 text-left disabled:cursor-default disabled:opacity-100"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    isComplete && "border-primary bg-secondary text-primary",
                    !isCurrent &&
                      !isComplete &&
                      "border-border bg-surface text-muted-foreground",
                    reachable && "group-hover:border-primary",
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    stepNumber
                  )}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                    reachable && "group-hover:text-foreground",
                  )}
                >
                  {getStepLabel(step)}
                </span>
              </button>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-2 h-px flex-1",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepHeader;
