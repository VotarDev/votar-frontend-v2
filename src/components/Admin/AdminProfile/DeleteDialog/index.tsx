import React, { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";
import { Button } from "@/src/components/ui/button";

interface AdminRecord {
  _id: string;
  username: string;
}

interface DeleteDialogProps {
  selectedAdmin: AdminRecord;
  onDelete: (admin: AdminRecord) => Promise<void>;
  isDeleting: boolean;
}

/** Delete button plus a confirmation dialog. */
const DeleteDialog = ({ selectedAdmin, onDelete, isDeleting }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const confirmDelete = async () => {
    try {
      await onDelete(selectedAdmin);
      close();
    } catch (_error) {
      // The parent displays the request error and keeps the dialog open.
    }
  };

  const titleId = `delete-admin-${selectedAdmin._id}`;
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Delete ${selectedAdmin.username}`}
        onClick={() => setOpen(true)}
        className="h-9 w-9 text-muted-foreground hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 />
      </Button>
      <DialogShell open={open} onClose={isDeleting ? () => {} : close} labelledBy={titleId}>
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              Delete “{selectedAdmin.username}”?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This removes the account and prevents future sign-ins.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 smm:flex-row smm:justify-end">
          <Button type="button" variant="outline" disabled={isDeleting} onClick={close} className="h-11">
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={isDeleting} onClick={confirmDelete} className="h-11">
            {isDeleting && <Loader2 className="animate-spin" />}
            Delete admin
          </Button>
        </div>
      </DialogShell>
    </>
  );
};

export default DeleteDialog;
