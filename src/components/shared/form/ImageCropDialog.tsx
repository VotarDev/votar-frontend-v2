import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { toast } from "react-hot-toast";
import Modal from "../../Modal";
import { Button } from "@/src/components/ui/button";
import getCroppedImg from "@/utils/cropImage";

interface ImageCropDialogProps {
  /** Data URL of the chosen image; the dialog is open while this is set. */
  imageSrc: string | null;
  onCancel: () => void;
  /** Receives the cropped image file. */
  onSave: (file: File) => void;
  aspect?: number;
  title?: string;
}

/** Crop an image to a fixed aspect ratio (16:9 for election backgrounds). */
const ImageCropDialog = ({
  imageSrc,
  onCancel,
  onSave,
  aspect = 16 / 9,
  title = "Crop your background",
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // Start each new image centred and unzoomed.
  useEffect(() => {
    if (imageSrc) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [imageSrc]);

  const onCropComplete = useCallback((_area: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (!croppedImage) throw new Error("Cropped image is null");
      onSave(croppedImage);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image. Please try again.");
    }
  };

  if (!isMounted) return null;

  // On <body> so the dialog and backdrop cover the whole screen, including
  // the fixed step bar.
  return createPortal(
    <div className="relative z-[1010]">
      <AnimatePresence>
        {imageSrc && (
          <Modal key="crop" handleClose={onCancel}>
            <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag to position the image. It will be shown at 16:9.
              </p>
              <div className="relative mt-4 h-[220px] w-full overflow-hidden rounded-md bg-slate-900">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  objectFit="cover"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[#015CE9]"
                />
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

export default ImageCropDialog;
