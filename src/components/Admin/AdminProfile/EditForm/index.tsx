import React from "react";

const EditForm = ({
  handleClose,
  onSubmit,
  formDetails,
  handleChange,
}: any) => {
  return (
    <div className="bg-white rounded-lg py-[24px] px-10 text-left">
      <div className="text-xl font-semibold pb-5">Edit Admin</div>
      <form onSubmit={onSubmit}>
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
            Edit Admin
          </button>
        </div>
      </form>
      <div className="flex justify-end mt-10">
        <button
          onClick={handleClose}
          className="bg-red-500 text-white w-40 h-12 rounded flex items-center justify-center outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditForm;
