import React from "react";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/utils/cn";

interface FormSectionProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

/** A titled card that groups related fields in a long form. */
const FormSection = ({
  title,
  description,
  className,
  children,
}: FormSectionProps) => (
  <Card className={cn("p-4 smm:p-6", className)}>
    <div className="mb-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="space-y-6">{children}</div>
  </Card>
);

export default FormSection;
