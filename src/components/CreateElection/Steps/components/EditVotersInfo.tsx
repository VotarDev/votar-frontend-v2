import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";

const EditVotersInfo = ({
  users,
  selectedRow,
  index,
  setUsers,
  setTrackChanges,
  trackChanges,
}: any) => {
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState({
    name: selectedRow.name,
    user_id: selectedRow.user_id,
    subGroup: selectedRow.subGroup,
    phone: selectedRow.phone,
    email: selectedRow.email,
  });
  const { name, subGroup, phone, email, user_id } = inputData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditUser = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const votersData = { ...inputData };

    const updatedUsers = users
      .filter(
        (item: any) =>
          item.name || item.phone || item.subGroup || item.email || item.user_id
      )
      .map((item: any, key: number) => {
        if (key === index) {
          return { ...votersData, id: item.id };
        } else {
          return item;
        }
      });
    //write a function that will check if the data has been changed and get the old and new data
    //then push it to the trackedChanges array
    const oldData = users[index];
    const newData = updatedUsers[index];
    const changedData = Object.keys(oldData).filter(
      (key) => oldData[key] !== newData[key]
    );
    const trackedData = { oldData, newData, changedData };
    setTrackChanges((prevData: any) => [...prevData, trackedData]);

    setUsers(updatedUsers);
    handleClickClose();
  };

  console.log(trackChanges);

  const formDetails = [
    {
      name: "name",
      id: "name",
      label: "Name",
      defaultValue: name,
    },
    {
      name: "user_id",
      id: "user_id",
      label: "User ID",
      defaultValue: user_id,
    },
    {
      name: "subGroup",
      id: "subGroup",
      label: "Sub-Group",
      defaultValue: subGroup,
    },
    {
      name: "phone",
      id: "phone",
      label: "Phone",
      defaultValue: phone,
    },
    {
      name: "email",
      id: "email",
      label: "Email",
      defaultValue: email,
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
            <div className="bg-white rounded-lg py-[24px] px-10 text-left">
              <div className="text-xl font-semibold pb-5">Edit User</div>
              <form onSubmit={handleEditUser}>
                <div className="flex flex-col gap-3">
                  {formDetails.map((detail: any, key: number) => {
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <label htmlFor={detail.name}>{detail.label}</label>
                        <input
                          type="text"
                          name={detail.name}
                          defaultValue={detail.defaultValue}
                          onChange={handleChange}
                          className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5">
                  <button className="w-full h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded">
                    Edit Voters Data
                  </button>
                </div>
              </form>
              <div className="flex justify-end mt-10">
                <button
                  onClick={handleClickClose}
                  className="bg-red-500 text-white w-40 h-12 rounded flex items-center justify-center outline-none"
                >
                  Close
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
