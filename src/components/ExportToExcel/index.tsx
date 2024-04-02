import React from "react";
import * as FileSaver from "file-saver";
import XSLX from "sheetjs-style";
import { Tooltip } from "@mui/material";
import { ExportToExcelProps } from "@/utils/types";

const ExportToExcel: React.FC<ExportToExcelProps> = ({
  excelData,
  fileName,
  children,
  className,
}) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToCSV = (excelData: any, fileName: any) => {
    const ws = XSLX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XSLX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <div>
      <Tooltip title="Export to Excel">
        <button
          onClick={(e) => exportToCSV(excelData, fileName)}
          className={className}
        >
          {children}
        </button>
      </Tooltip>
    </div>
  );
};

export default ExportToExcel;
