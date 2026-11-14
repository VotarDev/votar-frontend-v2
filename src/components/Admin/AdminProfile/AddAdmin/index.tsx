import React, { useState } from "react";
import { Loader2, UserPlus, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import FormField from "@/src/components/shared/form/FormField";

interface AddAdminProps {
  onSubmit: (values: { username: string; password: string }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

/** New admin account form (shown in a dialog). */
const AddAdmin = ({ onSubmit, onCancel, isSaving }: AddAdminProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ username: username.trim(), password });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="add-admin-title" className="text-lg font-semibold text-foreground">
              Add admin
            </h2>
            <p className="text-sm text-muted-foreground">Create an account for a new administrator.</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <FormField label="Username" htmlFor="admin-username" required>
          <Input
            id="admin-username"
            name="username"
            autoComplete="off"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormField>
        <FormField
          label="Temporary password"
          htmlFor="admin-password"
          required
          hint="At least 12 characters. Share it securely; they can change it later."
        >
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          New accounts start with access turned off. Turn access on when the account is ready to sign in.
        </p>
        <div className="flex flex-col-reverse gap-2 pt-2 smm:flex-row smm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving} className="h-11">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="h-11">
            {isSaving && <Loader2 className="animate-spin" />}
            Add admin
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
