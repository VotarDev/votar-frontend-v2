import React from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";

interface ImageUploadProps {
  id: string;
  accept: string;
  /** Data or blob URL of the chosen image. */
  previewUrl?: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
  /** e.g. "PNG, SVG, JPG or JPEG, up to 1MB". */
  requirements: string;
  previewClassName?: string;
}

/** Click-to-upload tile with a preview, and Replace / Remove once chosen. */
const ImageUpload = ({
  id,
  accept,
  previewUrl,
  onFileChange,
  onRemove,
  requirements,
  previewClassName,
}: ImageUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e);
    // Allow choosing the same file again after removing it.
    e.target.value = "";
  };

  return (
    <div>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
      {previewUrl ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border p-3 smm:flex-row smm:items-center">
          <img
            src={previewUrl}
            alt="Selected image preview"
            className={cn(
              "h-20 w-20 rounded-md border border-border bg-muted object-contain",
              previewClassName,
            )}
          />
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <label htmlFor={id} className="cursor-pointer">
                <RefreshCw /> Replace
              </label>
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:bg-red-50 hover:text-destructive"
              >
                <Trash2 /> Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-secondary/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Click to upload
          </span>
          <span className="text-xs text-muted-foreground">{requirements}</span>
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
