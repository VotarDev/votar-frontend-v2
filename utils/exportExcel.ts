import * as FileSaver from "file-saver";
import XSLX from "sheetjs-style";

const FILE_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

/** Download rows as an .xlsx file with a single "data" sheet. */
export const downloadExcel = (rows: object[], fileName: string) => {
  const ws = XSLX.utils.json_to_sheet(rows);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XSLX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: FILE_TYPE });
  FileSaver.saveAs(data, `${fileName}.xlsx`);
};
