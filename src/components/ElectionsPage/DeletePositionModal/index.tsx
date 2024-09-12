import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import { deleteElection, deletePosition } from "@/utils/api";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

const DeletePositionDialog = ({
  selectedPosition,
  id,
  admins,
  setAdmins,
  getUpdatedList,
  userId,
}: any) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClickOpen = (e: any) => {
    e.stopPropagation();

    setOpen(true);
  };

  const handleClickClose = (e: any) => {
    e.preventDefault();
    setOpen(false);
    e.stopPropagation();
  };
  const handleDeleteAdmin = () => {
    const filteredEmptyAdmin = admins.filter(
      (item: any) => item.name || item.username || item.password
    );
    const updatedUser = filteredEmptyAdmin.filter(
      (item: any, index: number) => index !== id
    );
    setAdmins(updatedUser);
  };

  const handleDeletePosition = async () => {
    setIsLoading(true);
    try {
      const dataBody = {
        election_id: id,
        name_of_position: selectedPosition,
      };
      const { data } = await deletePosition(dataBody, userId);
      if (data) {
        toast.success("Deleted Sucessfully");
        getUpdatedList();
        setIsLoading(false);
        setOpen(false);
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error);
      toast.error(error.response.data.message || error.message);
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer text-red-500">
        <DeleteIcon />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <div className="bg-white rounded-lg py-[24px] px-10 text-left text-xl text-slate-600">
              <div className="pb-10">{`Are you sure you want to delete "${selectedPosition}"?`}</div>
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
                <div className="w-full" onClick={handleDeletePosition}>
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

export default DeletePositionDialog;
