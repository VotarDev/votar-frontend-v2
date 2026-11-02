import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";

interface AdminRecord {
  _id: string;
  username: string;
}

interface DeleteDialogProps {
  selectedAdmin: AdminRecord;
  onDelete: (admin: AdminRecord) => Promise<void>;
  isDeleting: boolean;
}

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

  return (
    <>
      <button type="button" aria-label={`Delete ${selectedAdmin.username}`} onClick={() => setOpen(true)} className="cursor-pointer">
        <DeleteIcon />
      </button>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={close}>
            <div className="bg-white rounded-lg py-6 px-10 text-left text-xl text-slate-600">
              <div className="pb-6">Delete admin “{selectedAdmin.username}”?</div>
              <p className="pb-8 text-base">This removes the account and prevents future sign-ins.</p>
              <div className="flex gap-5 text-white">
                <button type="button" disabled={isDeleting} onClick={close} className="w-full h-12 bg-[#888888] rounded disabled:opacity-60">Cancel</button>
                <button type="button" disabled={isDeleting} onClick={confirmDelete} className="w-full h-12 bg-red-500 rounded disabled:opacity-60">{isDeleting ? "Deleting…" : "Delete"}</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteDialog;
