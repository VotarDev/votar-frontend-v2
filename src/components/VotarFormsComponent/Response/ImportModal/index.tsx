import React from "react";
import { FileSpreadsheet, Loader2, Upload } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";
import { Button } from "@/src/components/ui/button";

interface ImportModalProps {
  open: boolean;
  handleClose: () => void;
  handleFileUpload: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  isImporting: boolean;
}

/** Choose a spreadsheet of voters and import it into the responses. */
const ImportModal = ({
  open,
  handleClose,
  handleFileUpload,
  handleFileChange,
  selectedFile,
  isImporting,
}: ImportModalProps) => (
  <DialogShell
    open={open}
    onClose={() => !isImporting && handleClose()}
    labelledBy="import-title"
  >
    <h2 id="import-title" className="text-lg font-semibold text-foreground">
      Import from a spreadsheet
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Columns in this order: ID, Name, Sub-group, Phone number, Email. A heading
      row is skipped. Duplicates are flagged after import.
    </p>

    <label
      htmlFor="fileInput"
      className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-secondary/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
        <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
      </span>
      {selectedFile ? (
        <span className="max-w-full truncate text-sm font-medium text-foreground">
          {selectedFile.name}
        </span>
      ) : (
        <span className="text-sm font-medium text-foreground">
          Choose a file
        </span>
      )}
      <span className="text-xs text-muted-foreground">.xlsx, .xls or .csv</span>
      <input
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
    </label>

    <div className="mt-6 flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={isImporting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleFileUpload}
        disabled={!selectedFile || isImporting}
      >
        {isImporting ? <Loader2 className="animate-spin" /> : <Upload />}
        Import
      </Button>
    </div>
  </DialogShell>
);

export default ImportModal;
