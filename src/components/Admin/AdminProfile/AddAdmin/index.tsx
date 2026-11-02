import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface AddAdminProps {
  onSubmit: (values: { username: string; password: string }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const AddAdmin = ({ onSubmit, onCancel, isSaving }: AddAdminProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ username: username.trim(), password });
  };

  return (
    <div className="bg-white rounded-lg py-6 px-10 text-left">
      <div className="flex justify-end text-2xl">
        <button type="button" aria-label="Close" onClick={onCancel}><AiOutlineClose /></button>
      </div>
      <div className="max-w-[30rem] mx-auto">
        <h2 className="text-xl font-semibold pb-5">Add admin</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1" htmlFor="admin-username">
            Username
            <input id="admin-username" name="username" autoComplete="off" required value={username} onChange={(event) => setUsername(event.target.value)} className="border border-zinc-600 w-full rounded h-12 outline-none p-4" />
          </label>
          <label className="flex flex-col gap-1" htmlFor="admin-password">
            Temporary password
            <input id="admin-password" name="password" type="password" autoComplete="new-password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} className="border border-zinc-600 w-full rounded h-12 outline-none p-4" />
          </label>
          <p className="text-sm text-slate-600">New accounts start with access disabled. Enable access after creating the account.</p>
          <button disabled={isSaving} className="w-full h-12 flex items-center justify-center bg-blue-700 text-white rounded disabled:opacity-60">
            {isSaving ? "Saving…" : "Add admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
