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
    // Name centred under the (centred) election header; log out sits in the
    // corner, with side padding so a long name never runs under it.
    <div className="relative mx-auto w-full max-w-5xl px-14 pt-6 text-center ssm:px-28 smm:px-32">
      <p className="text-sm text-muted-foreground">{greeting},</p>
      <h1 className="break-words text-xl font-bold capitalize leading-tight text-foreground smm:text-2xl lg:text-3xl">
        {name || "Voter"}
      </h1>
      <Button
        variant="outline"
        onClick={() => setConfirmOpen(true)}
        className="absolute right-4 top-6 h-9 px-3 smm:h-10 smm:px-4"
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
