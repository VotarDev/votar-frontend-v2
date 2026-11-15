import React, { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { VoterResponse } from "@/utils/types";
import { editVoter } from "@/utils/api";
import DialogShell from "@/src/components/shared/DialogShell";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

interface EditVotersInfoProps {
  users: VoterResponse[];
  selectedRow: VoterResponse;
  index: number;
  setUsers: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
  handleResponseExported: () => Promise<void>;
}

const FIELDS: {
  name: keyof VoterResponse;
  label: string;
  disabled?: boolean;
  type?: string;
}[] = [
  { name: "name", label: "Name" },
  { name: "id", label: "Voter ID", disabled: true },
  { name: "subgroup", label: "Sub-group" },
  { name: "phoneNumber", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
];

/** Edit one voter's details. Same request and update as before. */
const EditVotersInfo = ({
  users,
  selectedRow,
  setUsers,
  handleResponseExported,
}: EditVotersInfoProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputData, setInputData] = useState<Partial<VoterResponse>>({});

  const handleOpen = () => {
    // Start from the voter's current details each time the dialog opens.
    setInputData({
      name: selectedRow.name,
      id: selectedRow.id,
      subgroup: selectedRow.subgroup,
      phoneNumber: selectedRow.phoneNumber,
      email: selectedRow.email,
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditUser = async () => {
    setIsEditing(true);

    try {
      const actualIndex = users.findIndex((user) => user.id === selectedRow.id);
      if (actualIndex === -1) {
        throw new Error("User not found in the array");
      }

      const updatedUsers = users.map((item, key) =>
        key === actualIndex
          ? {
              ...item,
              name: inputData.name || item.name,
              subgroup: inputData.subgroup || item.subgroup,
              phoneNumber: inputData.phoneNumber || item.phoneNumber,
              email: inputData.email || item.email,
            }
          : item,
      );

      const { election_id, phoneNumber, name, id, email } =
        updatedUsers[actualIndex];
      const bodyData = { election_id, phoneNumber, name, id, email };

      const { data } = await editVoter(bodyData);

      if (data) {
        setUsers(updatedUsers);
        handleResponseExported();
        handleClose();
        toast.success("Voter updated successfully");
      }
    } catch (error: any) {
      console.error(
        "API error:",
        error?.response?.data?.message || error.message,
      );
      toast.error(error?.response?.data?.message || "Failed to update voter");
    } finally {
      setIsEditing(false);
    }
  };

  const titleId = `edit-voter-${selectedRow.id}`;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`Edit ${selectedRow.name || "voter"}`}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <DialogShell open={open} onClose={handleClose} labelledBy={titleId}>
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Edit voter
        </h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleEditUser();
          }}
        >
          {FIELDS.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label
                htmlFor={`${titleId}-${field.name}`}
                className="text-sm font-medium text-foreground"
              >
                {field.label}
              </label>
              <Input
                id={`${titleId}-${field.name}`}
                name={field.name}
                type={field.type || "text"}
                value={(inputData[field.name] as string) ?? ""}
                onChange={handleChange}
                disabled={field.disabled}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditing}>
              {isEditing && <Loader2 className="animate-spin" />}
              {isEditing ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogShell>
    </>
  );
};

export default EditVotersInfo;
