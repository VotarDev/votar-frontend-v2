import React, { useState } from "react";

const EditModal: React.FC<{
  onEdit: (newContent: string) => void;
  option: string;
  handleClose: () => void;
}> = ({ onEdit, option, handleClose }) => {
  const [newContent, setNewContent] = useState<string>(option);

  const handleEdit = () => {
    onEdit(newContent);
    handleClose();
    setNewContent("");
  };

  return (
    <div className="bg-white flex justify-center w-96  mx-auto items-center py-5 rounded-lg">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          className="border-b border-zinc-600 h-10 outline-none p-2 w-full"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <div className="flex justify-center">
          <div
            onClick={handleEdit}
            className="bg-blue-700 cursor-pointer text-zinc-200 outline-none rounded-md p-2 mt-3 flex justify-center items-center w-20"
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
