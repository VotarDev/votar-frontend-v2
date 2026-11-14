import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";

interface VoterBarProps {
  greeting: string;
  name?: string;
  onLogout: () => void | Promise<unknown>;
  /** Warn that unsubmitted choices will be lost. */
  hasUnsavedChoices?: boolean;
}

/** "Welcome, Ada" with the log out button, under the election header. */
const VoterBar = ({
  greeting,
  name,
  onLogout,
  hasUnsavedChoices,
}: VoterBarProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-3 px-4 pt-6 smm:items-center smm:gap-4">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <h1 className="break-words text-lg font-bold capitalize leading-tight text-foreground ssm:text-xl smm:text-2xl">
          {name || "Voter"}
        </h1>
      </div>
      <Button
        variant="outline"
        onClick={() => setConfirmOpen(true)}
        className="h-9 shrink-0 px-3 smm:h-10 smm:px-4"
        aria-label="Log out"
      >
        <LogOut />
        <span className="hidden ssm:inline">Log out</span>
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onLogout}
        icon={LogOut}
        destructive
        title="Log out of this ballot?"
        description={
          hasUnsavedChoices
            ? "Your choices haven't been submitted yet and will be lost. You'll need to log in again to vote."
            : "You'll need to log in again to come back to this ballot."
        }
        confirmLabel="Log out"
        cancelLabel="Stay"
      />
    </div>
  );
};

export default VoterBar;
