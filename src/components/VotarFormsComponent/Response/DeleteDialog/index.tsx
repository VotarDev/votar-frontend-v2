import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import { deleteVoter, deleteVoterResponse } from "@/utils/api";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const DeleteDialog = ({
  selectedVoter,
  id,
  voters,
  setVoters,
  row,
  getUpdatedList,
  electionId,
}: any) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const bodyData = {
        voter_id: row.id,
        email: row.email,
        election_id: electionId,
      };

      const { data } = await deleteVoterResponse(bodyData);
      if (data) {
        setIsLoading(false);
        getUpdatedList();
        toast.success("Deleted");
      }
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
    }
  };
  const handleDeleteAdmin = () => {
    const filteredEmptyAdmin = voters.filter(
      (item: any) => item.name || item.username || item.password,
    );
    const updatedUser = filteredEmptyAdmin.filter(
      (item: any, index: number) => index !== id,
    );
    setVoters(updatedUser);
  };

  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer">
        <DeleteIcon />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <div className="bg-white rounded-lg py-[24px] px-10 text-left text-xl text-slate-600 opacity-100">
              <div className="pb-10">{`Are you sure you want to delete "${selectedVoter}"?`}</div>
              <div className="pb-8 text-base">
                This will permanently remove the details from the system and
                cannot be reversed.
              </div>
              <div className="text-white flex gap-5">
                <div className="w-full">
                  <button
                    className="bg-[#888888] w-full flex-1 h-12 outline-none rounded"
                    onClick={handleClickClose}
                  >
                    Cancel
                  </button>
                </div>
                <div className="w-full" onClick={handleDelete}>
                  <button
                    className="bg-red-500 w-full flex h-12 outline-none rounded items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <CircularProgress
                        color="inherit"
                        className=" text-white"
                        size={20}
                      />
                    )}
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteDialog;
