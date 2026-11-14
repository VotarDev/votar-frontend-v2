import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface VoterBarProps {
  greeting: string;
  name?: string;
  onLogout: () => void;
}

/** "Welcome, Ada" with the log out button, under the election header. */
const VoterBar = ({ greeting, name, onLogout }: VoterBarProps) => (
  <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-6">
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{greeting},</p>
      <h1 className="truncate text-xl font-bold capitalize text-foreground smm:text-2xl">
        {name || "Voter"}
      </h1>
    </div>
    <Button variant="outline" onClick={onLogout} className="h-10 shrink-0">
      <LogOut /> Log out
    </Button>
  </div>
);

export default VoterBar;
