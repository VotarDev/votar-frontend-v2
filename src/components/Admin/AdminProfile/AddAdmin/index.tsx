import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddAdmin = ({ handleClose, admins, setAdmins }: any) => {
  const [value, setValues] = useState({ name: "", username: "", password: "" });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const adminData = { ...value, access: false };
    setAdmins([...admins, adminData]);
    handleClose();
    console.log(adminData);
  };
  return (
    <div className="bg-white rounded-lg pt-[24px] pb-[83px] px-10 text-left">
      <div
        className="flex justify-end text-2xl cursor-pointer"
        onClick={handleClose}
      >
        <AiOutlineClose />
      </div>
      <div className="max-w-[30rem] mx-auto">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-5">
            <button className="w-full h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
