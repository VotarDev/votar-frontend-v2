import React, { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";
import FormField from "@/src/components/shared/form/FormField";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

interface AdminRecord {
  _id: string;
  username: string;
}

interface EditAdminFormProps {
  selectedAdmin: AdminRecord;
  onSave: (id: string, values: { username: string; password?: string }) => Promise<void>;
  isSaving: boolean;
}

/** Edit button plus a dialog to rename an admin or set a new password. */
const EditAdminForm = ({ selectedAdmin, onSave, isSaving }: EditAdminFormProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(selectedAdmin.username);
  const [password, setPassword] = useState("");
  const close = () => setOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values: { username: string; password?: string } = { username: username.trim() };
    if (password) values.password = password;
    try {
      await onSave(selectedAdmin._id, values);
      setPassword("");
      close();
    } catch (_error) {
      // The parent displays the request error and keeps the form open.
    }
  };

  const titleId = `edit-admin-${selectedAdmin._id}`;
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Edit ${selectedAdmin.username}`}
        onClick={() => {
          setUsername(selectedAdmin.username);
          setOpen(true);
        }}
        className="h-9 w-9 text-muted-foreground hover:text-foreground"
      >
        <Pencil />
      </Button>
      <DialogShell open={open} onClose={close} labelledBy={titleId}>
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Edit admin
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <FormField label="Username" htmlFor={`username-${selectedAdmin._id}`} required>
            <Input
              id={`username-${selectedAdmin._id}`}
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </FormField>
          <FormField
            label="New password"
            htmlFor={`password-${selectedAdmin._id}`}
            optional
            hint="Leave blank to keep the current password. At least 12 characters."
          >
            <Input
              id={`password-${selectedAdmin._id}`}
              type="password"
              autoComplete="new-password"
              minLength={12}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormField>
          <div className="flex flex-col-reverse gap-2 pt-2 smm:flex-row smm:justify-end">
            <Button type="button" variant="outline" onClick={close} className="h-11">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="h-11">
              {isSaving && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </DialogShell>
    </>
  );
};

export default EditAdminForm;
