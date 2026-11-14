import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FileText,
  ImagePlus,
  Paperclip,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Position } from "@/utils/types";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import FormField from "@/src/components/shared/form/FormField";

const IMAGE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB
const MEDIA_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
const DETAILS_MAX_LENGTH = 250;

/** An object URL for a file, released when the file changes or on unmount. */
const useObjectUrl = (file: Blob | MediaSource | null | undefined) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
};

const CandidatePhoto = ({
  inputId,
  candidate,
  disabled,
}: {
  inputId: string;
  candidate: any;
  disabled: boolean;
}) => {
  const picture = candidate.candidate_picture;
  // A saved photo comes back from the API as a URL; a new one is a file.
  const savedUrl = typeof picture === "string" ? picture : null;
  const objectUrl = useObjectUrl(
    candidate.candidate_picture_base64 || savedUrl ? null : picture,
  );
  const src = candidate.candidate_picture_base64 || savedUrl || objectUrl;
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <label
        htmlFor={inputId}
        className={`group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-primary/50 hover:bg-secondary/40"
        }`}
      >
        {src ? (
          <>
            <img
              src={src}
              alt={`Photo of ${candidate.candidate_name || "candidate"}`}
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Change photo
              </span>
            )}
          </>
        ) : (
          <span className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs font-medium">Add photo</span>
          </span>
        )}
      </label>
      <span className="text-xs text-muted-foreground">Max 2 MB</span>
    </div>
  );
};

const MediaAttachment = ({
  candidate,
  disabled,
  onRemove,
}: {
  candidate: any;
  disabled: boolean;
  onRemove: (e: React.MouseEvent) => void;
}) => {
  // A saved attachment comes back from the API as a URL string.
  const savedUrl: string | null =
    typeof candidate.media === "string" ? candidate.media : null;
  const type = savedUrl
    ? /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(savedUrl)
      ? "image"
      : /\.(mp4|webm|mov)(\?|$)/i.test(savedUrl)
        ? "video"
        : "file"
    : candidate.media?.type;
  const objectUrl = useObjectUrl(
    !savedUrl && (type === "image" || type === "video")
      ? candidate.media?.docs
      : null,
  );
  const url = savedUrl || objectUrl;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-2 pr-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {type === "image" && url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : type === "video" && url ? (
          <video src={url} className="h-full w-full object-cover" muted />
        ) : (
          <FileText className="h-5 w-5" aria-hidden="true" />
        )}
      </div>
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {candidate.docsname ||
          (savedUrl
            ? decodeURIComponent(savedUrl.split("?")[0].split("/").pop() || "")
            : "") ||
          "Attached file"}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={onRemove}
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label="Remove attachment"
      >
        <X />
      </Button>
    </div>
  );
};

interface BodyProps {
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  electionId?: string;
  isEditable?: boolean;
  // Options for the edit-election ballot, whose data is shaped a little
  // differently. The create flow uses the defaults.
  /** A new, empty position. */
  newPosition?: () => any;
  /** A new, empty candidate. */
  newCandidate?: () => any;
  /** Keep a base64 copy of new photos (the create flow's preview uses it). */
  storePictureBase64?: boolean;
  /** What a removed attachment becomes (by default its file is cleared). */
  clearedMedia?: unknown;
  /** Replace the local removal, e.g. to delete through the API. */
  onDeletePosition?: (positionIndex: number) => void;
  onDeleteCandidate?: (positionIndex: number, candidateIndex: number) => void;
}

const hasMedia = (candidate: any) =>
  typeof candidate.media === "string"
    ? !!candidate.media
    : !!candidate.media?.docs;

function Body({
  positions,
  setPositions,
  electionId,
  isEditable = true,
  newPosition,
  newCandidate,
  storePictureBase64 = true,
  clearedMedia,
  onDeletePosition,
  onDeleteCandidate,
}: BodyProps) {
  const handleAddPosition = () => {
    setPositions([
      ...positions,
      newPosition
        ? newPosition()
        : {
            name_of_position: "",
            show_pictures: true,
            allow_abstain: true,
            candidates: [],
            election_id: electionId,
          },
    ]);
  };

  const handleAddCandidate = (positionIndex: number) => {
    const updatedPositions = [...positions];
    updatedPositions[positionIndex].candidates.push(
      newCandidate
        ? newCandidate()
        : {
            candidate_name: "",
            candidate_nickname: "",
            more_details: "",
            candidate_picture: null,
            candidate_picture_base64: null,
            filename: "",
            docsname: "",
            media: { type: "file", docs: null },
            votes: 0,
          },
    );
    setPositions(updatedPositions);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    positionIndex: number,
    field: keyof Position,
    candidateIndex?: number,
  ) => {
    const updatedPositions = [...positions];
    if (candidateIndex !== undefined) {
      (updatedPositions[positionIndex].candidates[candidateIndex] as any)[
        field
      ] = e.target.value;
    } else {
      (updatedPositions[positionIndex] as any)[field] = e.target.value;
    }
    setPositions(updatedPositions);
  };

  const handleShowPicture = (checked: boolean, positionIndex: number) => {
    const updatedPosition = [...positions];
    updatedPosition[positionIndex].show_pictures = checked;
    setPositions(updatedPosition);
  };

  const handleAllowAbstain = (checked: boolean, positionIndex: number) => {
    const updatedPosition = [...positions];
    updatedPosition[positionIndex].allow_abstain = checked;
    setPositions(updatedPosition);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number,
    candidateIndex: number,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (file) {
      if (file.size > IMAGE_SIZE_LIMIT) {
        toast.error("Image must be 2 MB or smaller.");
        return;
      }
      if (!storePictureBase64) {
        const updatedPositions = [...positions];
        const candidate: any =
          updatedPositions[positionIndex].candidates[candidateIndex];
        candidate.candidate_picture = file;
        candidate.filename = file.name;
        setPositions(updatedPositions);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPositions = [...positions];
        const candidate =
          updatedPositions[positionIndex].candidates[candidateIndex];

        candidate.candidate_picture = file;
        candidate.candidate_picture_base64 = reader.result as string;
        candidate.filename = file.name;

        setPositions(updatedPositions);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number,
    candidateIndex: number,
  ) => {
    const { files } = e.target;
    const file = files?.[0];
    e.target.value = "";

    if (file) {
      if (file.size > MEDIA_SIZE_LIMIT) {
        toast.error("Media file must be 10 MB or smaller.");
        return;
      }
      const updatedPositions = [...positions];
      const candidate =
        updatedPositions[positionIndex].candidates[candidateIndex];
      const mediaType = file.type.split("/")[0];

      candidate.media = {
        type: mediaType as "file" | "image" | "video",
        docs: file,
      };
      candidate.docsname = file.name;

      setPositions(updatedPositions);
    }
  };

  const handleDeleteMedia = (
    e: React.MouseEvent,
    positionIndex: number,
    candidateIndex: number,
  ) => {
    e.preventDefault();

    const updatedPositions = [...positions];
    const candidate =
      updatedPositions[positionIndex].candidates[candidateIndex];

    if (candidate) {
      if (clearedMedia !== undefined) {
        (candidate as any).media = clearedMedia;
      } else {
        (candidate.media as any).docs = null;
      }
    }

    setPositions(updatedPositions);
  };

  const deletePosition = (index: number) => {
    if (onDeletePosition) return onDeletePosition(index);
    if (positions.length > 1) {
      const newPositions = positions.filter((_: any, i: any) => i !== index);
      setPositions(newPositions);
    }
  };

  const deleteCandidate = (positionIndex: number, candidateIndex: number) => {
    if (onDeleteCandidate)
      return onDeleteCandidate(positionIndex, candidateIndex);
    const newPositions = [...positions];

    newPositions[positionIndex].candidates = newPositions[
      positionIndex
    ].candidates.filter((_: any, i: any) => i !== candidateIndex);
    setPositions(newPositions);
  };

  return (
    <section>
      {/* Every button here is type="button": a plain button inside a form
          submits it, which reloaded the page and lost the ballot. */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {positions.map((position: Position, positionIndex: number) => {
          const positionInputId = `position-name-${positionIndex}`;
          return (
            <Card key={positionIndex} className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 smm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {positionIndex + 1}
                  </span>
                  <h3 className="truncate font-semibold text-foreground">
                    {position.name_of_position ||
                      `Position ${positionIndex + 1}`}
                  </h3>
                  <span className="hidden shrink-0 text-sm text-muted-foreground ssm:inline">
                    · {position.candidates.length}{" "}
                    {position.candidates.length === 1
                      ? "candidate"
                      : "candidates"}
                  </span>
                </div>
                {positionIndex > 0 && isEditable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePosition(positionIndex)}
                    className="shrink-0 text-destructive hover:bg-red-50 hover:text-destructive"
                  >
                    <Trash2 />
                    <span className="hidden smm:inline">Remove position</span>
                  </Button>
                )}
              </div>

              <div className="space-y-6 p-4 smm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <FormField
                    label="Name of position"
                    htmlFor={positionInputId}
                    required
                    className="flex-1"
                  >
                    <Input
                      id={positionInputId}
                      placeholder="e.g. President"
                      value={position.name_of_position ?? ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        handleInputChange(e, positionIndex, "name_of_position")
                      }
                    />
                  </FormField>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 md:pb-2.5">
                    <label className="flex items-center gap-2.5 text-sm text-foreground">
                      <Switch
                        checked={position.show_pictures}
                        disabled={!isEditable}
                        onCheckedChange={(checked) =>
                          handleShowPicture(checked, positionIndex)
                        }
                      />
                      Show pictures
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-foreground">
                      <Switch
                        checked={position.allow_abstain}
                        disabled={!isEditable}
                        onCheckedChange={(checked) =>
                          handleAllowAbstain(checked, positionIndex)
                        }
                      />
                      Allow abstain
                    </label>
                  </div>
                </div>

                {position.candidates.length === 0 && (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-center">
                    <UserRound
                      className="h-6 w-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-muted-foreground">
                      No candidates yet. Add the people standing for this
                      position.
                    </p>
                  </div>
                )}

                {position.candidates.map((candidate, candidateIndex) => {
                  const base = `${positionIndex}-${candidateIndex}`;
                  return (
                    <div
                      key={candidateIndex}
                      className="rounded-lg border border-border p-4 smm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {candidate.candidate_name ||
                            `Candidate ${candidateIndex + 1}`}
                        </p>
                        {isEditable && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              deleteCandidate(positionIndex, candidateIndex)
                            }
                            className="shrink-0 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                          >
                            <Trash2 />
                            <span className="hidden smm:inline">Remove</span>
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col gap-5 md:flex-row">
                        {position.show_pictures && (
                          <>
                            <CandidatePhoto
                              inputId={`image-upload-${base}`}
                              candidate={candidate}
                              disabled={!isEditable}
                            />
                            <input
                              type="file"
                              id={`image-upload-${base}`}
                              accept="image/*"
                              disabled={!isEditable}
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(
                                  e,
                                  positionIndex,
                                  candidateIndex,
                                )
                              }
                            />
                          </>
                        )}

                        <div className="flex-1 space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              label="Candidate name"
                              htmlFor={`candidate-name-${base}`}
                              required
                            >
                              <Input
                                id={`candidate-name-${base}`}
                                placeholder="Full name"
                                value={candidate.candidate_name ?? ""}
                                disabled={!isEditable}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    positionIndex,
                                    "candidate_name" as keyof Position,
                                    candidateIndex,
                                  )
                                }
                              />
                            </FormField>
                            <FormField
                              label="Nickname"
                              htmlFor={`candidate-nickname-${base}`}
                              optional
                            >
                              <Input
                                id={`candidate-nickname-${base}`}
                                placeholder="What voters know them as"
                                value={candidate.candidate_nickname ?? ""}
                                disabled={!isEditable}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    positionIndex,
                                    "candidate_nickname" as keyof Position,
                                    candidateIndex,
                                  )
                                }
                              />
                            </FormField>
                          </div>

                          <FormField
                            label="More details"
                            htmlFor={`candidate-details-${base}`}
                            optional
                          >
                            <Textarea
                              id={`candidate-details-${base}`}
                              placeholder="A short bio or manifesto"
                              value={candidate.more_details ?? ""}
                              maxLength={DETAILS_MAX_LENGTH}
                              disabled={!isEditable}
                              className="min-h-[96px]"
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  positionIndex,
                                  "more_details" as keyof Position,
                                  candidateIndex,
                                )
                              }
                            />
                            <span className="self-end text-xs text-muted-foreground">
                              {candidate.more_details?.length || 0}/
                              {DETAILS_MAX_LENGTH}
                            </span>
                          </FormField>

                          <div>
                            <input
                              type="file"
                              id={`media-upload-${base}`}
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              disabled={!isEditable}
                              className="hidden"
                              onChange={(e) =>
                                handleMediaUpload(
                                  e,
                                  positionIndex,
                                  candidateIndex,
                                )
                              }
                            />
                            {hasMedia(candidate) ? (
                              <MediaAttachment
                                candidate={candidate}
                                disabled={!isEditable}
                                onRemove={(e) =>
                                  handleDeleteMedia(
                                    e,
                                    positionIndex,
                                    candidateIndex,
                                  )
                                }
                              />
                            ) : (
                              <label
                                htmlFor={`media-upload-${base}`}
                                className={`flex w-full items-center gap-3 rounded-lg border border-dashed border-border px-3 py-3 text-left transition-colors ${
                                  isEditable
                                    ? "cursor-pointer hover:border-primary hover:bg-secondary/40"
                                    : "cursor-not-allowed opacity-60"
                                }`}
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                                  <Paperclip
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="flex min-w-0 flex-col">
                                  <span className="whitespace-nowrap text-sm font-medium text-primary">
                                    Attach media
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Image, video, PDF or DOC · Max 10 MB
                                  </span>
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  disabled={!isEditable}
                  onClick={() => handleAddCandidate(positionIndex)}
                  className="w-full border-dashed"
                >
                  <Plus /> Add candidate
                </Button>
              </div>
            </Card>
          );
        })}

        <button
          type="button"
          disabled={!isEditable}
          onClick={handleAddPosition}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/40 bg-secondary/40 py-5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add position
        </button>
      </form>
    </section>
  );
}

export default Body;
