import React from "react";

const ImportModal = ({
  handleClose,
  handleFileUpload,
  handleFileChange,
  selectedFile,
}: any) => {
  return (
    <div className="bg-white rounded-lg py-[24px] px-10 text-left">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-xl font-semibold">Import From Excel Sheet</h1>
        <div className="pt-10 flex items-center gap-2">
          <label htmlFor="fileInput">
            <span className="bg-blue-700 text-white p-4 rounded-lg cursor-pointer">
              Select File
            </span>

            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="fileInput"
            />
          </label>
          {selectedFile && <p>: {selectedFile.name}</p>}
        </div>
        <div className="mt-10">
          {selectedFile && (
            <button
              onClick={handleFileUpload}
              className="w-40 h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded"
            >
              Upload
            </button>
          )}
        </div>
      </div>

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

export default ImportModal;
