import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import { deleteElection } from "@/utils/api";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const DeleteDialog = ({
  selectedAdmin,
  id,
  admins,
  setAdmins,
  getUpdatedList,
  userId,
}: any) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClickOpen = () => setOpen(true);

  const handleClickClose = () => setOpen(false);
  const handleDeleteAdmin = () => {
    const filteredEmptyAdmin = admins.filter(
      (item: any) => item.name || item.username || item.password
    );
    const updatedUser = filteredEmptyAdmin.filter(
      (item: any, index: number) => index !== id
    );
    setAdmins(updatedUser);
  };

  const handleDeleteElection = async () => {
    setIsLoading(true);
    try {
      const dataBody = { election_id: id };
      const { data } = await deleteElection(userId, dataBody);
      if (data) {
        toast.success("Deleted Succesfully");
        getUpdatedList();
        setIsLoading(false);
        setOpen(false);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(error.response.data.message || error.message);
      setOpen(false);
    }
  };

  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer">
        <DeleteIcon />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <div className="bg-white rounded-lg py-[24px] px-10 text-left text-xl text-slate-600">
              <div className="pb-10">{`Are you sure you want to delete "${selectedAdmin}"?`}</div>
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
                <div className="w-full" onClick={handleDeleteElection}>
                  <button
                    className="bg-red-500 w-full flex-1 h-12 outline-none rounded flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <CircularProgress
                        color="inherit"
                        className=" text-white mr-2"
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
