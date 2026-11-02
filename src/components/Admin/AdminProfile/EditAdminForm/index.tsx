import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";

interface AdminRecord {
  _id: string;
  username: string;
}

interface EditAdminFormProps {
  selectedAdmin: AdminRecord;
  onSave: (id: string, values: { username: string; password?: string }) => Promise<void>;
  isSaving: boolean;
}

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

  return (
    <>
      <button type="button" aria-label={`Edit ${selectedAdmin.username}`} onClick={() => setOpen(true)} className="cursor-pointer">
        <EditIcon />
      </button>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={close}>
            <div className="bg-white rounded-lg py-6 px-10 text-left">
              <h2 className="text-xl font-semibold pb-5">Edit admin</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1" htmlFor={`username-${selectedAdmin._id}`}>
                  Username
                  <input id={`username-${selectedAdmin._id}`} required value={username} onChange={(event) => setUsername(event.target.value)} className="border border-zinc-600 w-full rounded h-12 outline-none p-4" />
                </label>
                <label className="flex flex-col gap-1" htmlFor={`password-${selectedAdmin._id}`}>
                  Set a new password <span className="text-sm text-slate-500">Leave blank to keep the current password.</span>
                  <input id={`password-${selectedAdmin._id}`} type="password" autoComplete="new-password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="border border-zinc-600 w-full rounded h-12 outline-none p-4" />
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={close} className="w-full h-12 bg-slate-400 text-white rounded">Cancel</button>
                  <button disabled={isSaving} className="w-full h-12 bg-blue-700 text-white rounded disabled:opacity-60">{isSaving ? "Saving…" : "Save changes"}</button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditAdminForm;
