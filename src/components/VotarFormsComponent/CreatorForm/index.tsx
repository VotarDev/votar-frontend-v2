import React, { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { BsLink } from "react-icons/bs";
import InputSelect from "../../InputSelect";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "@/src/components/Modal";
import EditModal from "./EditModal";
import { toast } from "react-hot-toast";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { createVotarForms } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";

interface Item {
  id: number;
  option: string;
}

const CreatorForm = () => {
  const [subGroup, setSubGroup] = useState<Item[]>([]);
  const [toggleAddSubGroup, setToggleAddSubGroup] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newItemContent, setNewItemContent] = useState<string>("Add option");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const users = useCurrentUser();
  const user = useUser();
  const router = useRouter();

  console.log(subGroup[0].option);

  const option = subGroup.map((item) => {
    return { value: item.option, label: item.option };
  });

  const addItem = () => {
    const newItem: Item = {
      id: Date.now(),
      option: newItemContent,
    };
    setSubGroup((prev) => [...prev, newItem]);
  };

  const startEditing = (itemId: number) => {
    setEditingItemId(itemId);
    handleOpen();
  };

  const finishEditing = (newContent: string) => {
    setSubGroup((prevItems) =>
      prevItems.map((item) =>
        item.id === editingItemId ? { ...item, option: newContent } : item
      )
    );
    setEditingItemId(null);
  };

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  //   const editItem = (itemId: number, newContent: string) => {
  //     setSubGroup((prevItems) =>
  //       prevItems.map((item) =>
  //         item.id === itemId ? { ...item, option: newContent } : item
  //       )
  //     );
  //   };

  const handleViewResponse = () => {
    router.push("/votar-forms/responses");
  };

  const deleteItem = (itemId: number) => {
    setSubGroup((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else {
      if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }
    }
    try {
      if (typeof window !== "undefined") {
        const electionId = localStorage.getItem("ElectionId");
        const formData = {
          electionId: electionId,
          subGroup: subGroup[0].option,
        };
        const { data } = await createVotarForms(formData, USER_ID);
        if (data) {
          toast.success(data.status);
          console.log(data);
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText("http://votar.ng/usersForm");
    toast.success("Link copied to clipboard");
  };

  const handleOpen = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);

  return (
    <div>
      <div className="text-xl text-center pt-5">
        <span className="font-bold">INSTRUCTION:</span> Please Fill in your
        Details Correctly
      </div>
      <form onSubmit={formHandler} className="pt-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              name="id"
              className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
            />
          </div>
          <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="border border-zinc-400 px-10 py-16 rounded-lg relative flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="subGroup">Sub-Group</label>
                <InputSelect
                  placeholder={""}
                  option={option}
                  optionValue={""}
                  className={
                    "lg:w-[40%] h-10 w-full placeholder:white cursor-pointer"
                  }
                />
              </div>
              {!toggleAddSubGroup && (
                <div className="">
                  <button
                    onClick={() => setToggleAddSubGroup(true)}
                    className="flex items-center justify-center outline-none text-xl font-semibold"
                  >
                    + Add Sub-Group
                  </button>
                </div>
              )}
              {toggleAddSubGroup && (
                <div className="right-6  bg-white z-10 rounded-md shadow-lg p-4">
                  <h1 className="text-center underline pb-5">Add Subgroup</h1>
                  <div className="flex flex-col gap-2">
                    {subGroup.map((sub, index) => (
                      <div className="flex items-center gap-2" key={index}>
                        <div>
                          <input
                            type="text"
                            name="subGroup"
                            value={sub.option}
                            onChange={(e) => setNewItemContent(e.target.value)}
                            className="border-b border-zinc-600 outline-none p-2"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => startEditing(sub.id)}
                            className="cursor-pointer"
                          >
                            <MdEdit />
                          </span>
                          <span
                            onClick={() => deleteItem(sub.id)}
                            className="cursor-pointer"
                          >
                            <MdDelete />
                          </span>
                        </div>
                      </div>
                    ))}
                    <AnimatePresence mode="wait">
                      {openEdit && (
                        <Modal key="modal" handleClose={handleClose}>
                          <EditModal
                            option={
                              subGroup.find((item) => item.id === editingItemId)
                                ?.option || ""
                            }
                            handleClose={handleClose}
                            onEdit={(newContent) => finishEditing(newContent)}
                          />
                        </Modal>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={addItem}
                        className="bg-blue-700 text-zinc-200 outline-none rounded-md p-2 mt-3 flex justify-center items-center w-20"
                      >
                        Add +
                      </button>
                      <button
                        onClick={() => setToggleAddSubGroup(false)}
                        className="bg-zinc-200 text-slate-900 outline-none rounded-md p-2 mt-3 flex justify-center items-center w-20"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
            />
          </div>
          <div className="flex flex-col gap-1 border border-zinc-400 px-10 py-16 rounded-lg">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              className="border-b border-zinc-600 w-1/3 h-10 outline-none p-2"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="p-4 w-40 h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded-lg gap-2 text-lg"
              disabled={isLoading}
            >
              <span>Create Form</span>
              {isLoading && (
                <CircularProgress
                  color="inherit"
                  className=" text-white"
                  size={20}
                />
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="mt-5 flex justify-end gap-3 py-5">
        <button
          className="p-4 h-12 outline-none flex items-center justify-center border border-blue-700 text-blue-700 rounded-lg gap-2 text-lg"
          onClick={() => copyLink()}
        >
          <span className="text-3xl">
            <BsLink />
          </span>
          Copy Link
        </button>
        <button
          className="p-4 h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded-lg gap-2 text-lg"
          onClick={handleViewResponse}
        >
          View Response
          <span className="text-3xl">
            <IoIosArrowRoundForward />
          </span>
        </button>
      </div>
    </div>
  );
};

export default CreatorForm;
