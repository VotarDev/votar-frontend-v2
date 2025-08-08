import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import { VoterResponse } from "@/utils/types";
import { editVoter } from "@/utils/api";
import { toast } from "react-hot-toast";

interface EditVotersInfoProps {
  users: VoterResponse[];
  selectedRow: VoterResponse;
  index: number;
  setUsers: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
  handleResponseExported: () => Promise<void>;
}

const EditVotersInfo = ({
  users,
  selectedRow,
  index,
  setUsers,
  handleResponseExported,
}: EditVotersInfoProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputData, setInputData] = useState<Partial<VoterResponse>>({
    name: selectedRow.name,
    id: selectedRow.id,
    subgroup: selectedRow.subgroup,
    phoneNumber: selectedRow.phoneNumber,
    email: selectedRow.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditUser = async () => {
    setIsEditing(true);

    try {
      // Find the actual index of the selected row in the full users array
      const actualIndex = users.findIndex((user) => user.id === selectedRow.id);

      if (actualIndex === -1) {
        throw new Error("User not found in the array");
      }

      const updatedUsers = users.map((item, key) => {
        if (key === actualIndex) {
          // Use actualIndex instead of index
          return {
            ...item,
            name: inputData.name || item.name,
            subgroup: inputData.subgroup || item.subgroup,
            phoneNumber: inputData.phoneNumber || item.phoneNumber,
            email: inputData.email || item.email,
          };
        }
        return item;
      });

      const { election_id, phoneNumber, name, id, email } =
        updatedUsers[actualIndex];
      const bodyData = {
        election_id,
        phoneNumber,
        name,
        id,
        email,
      };

      const { data } = await editVoter(bodyData);

      if (data) {
        setUsers(updatedUsers);
        handleResponseExported();
        setIsEditing(false);
        handleClickClose();
        toast.success("Voter updated successfully");
      }
    } catch (error: any) {
      console.error(
        "API error:",
        error?.response?.data?.message || error.message
      );
      setIsEditing(false);
      toast.error(error?.response?.data?.message || "Failed to update voter");
    }
  };

  const formDetails = [
    {
      name: "name",
      id: "name",
      label: "Name",
      defaultValue: inputData.name,
    },
    {
      name: "id",
      id: "id",
      label: "User ID",
      defaultValue: inputData.id,
      disabled: true,
    },
    {
      name: "subgroup",
      id: "subgroup",
      label: "Sub-Group",
      defaultValue: inputData.subgroup,
    },
    {
      name: "phoneNumber",
      id: "phoneNumber",
      label: "Phone",
      defaultValue: inputData.phoneNumber,
    },
    {
      name: "email",
      id: "email",
      label: "Email",
      defaultValue: inputData.email,
    },
  ];

  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer">
        <EditIcon />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <div className="bg-white rounded-lg py-6 px-10 text-left max-w-[800px] w-full">
              <div className="text-xl font-semibold pb-5">Edit Voter</div>
              <form>
                <div className="flex flex-col gap-4">
                  {formDetails.map((detail, key) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label
                        htmlFor={detail.name}
                        className="text-sm font-medium"
                      >
                        {detail.label}
                      </label>
                      <input
                        type="text"
                        name={detail.name}
                        defaultValue={detail.defaultValue}
                        onChange={handleChange}
                        disabled={detail.disabled}
                        className="border border-zinc-300 rounded h-12 outline-none p-4 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </form>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClickClose}
                  className="bg-gray-300 text-gray-800 w-40 h-12 rounded flex items-center justify-center outline-none hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditUser();
                  }}
                  disabled={isEditing}
                  className="bg-blue-700 text-white w-40 h-12 rounded flex items-center justify-center outline-none hover:bg-blue-800"
                >
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditVotersInfo;
