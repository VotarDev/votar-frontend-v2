import React, { useState } from "react";
import leftline from "../../../../public/assets/images/left-line.svg";
import rightline from "../../../../public/assets/images/right-line.svg";
import { Checkbox, FormControlLabel } from "@mui/material";
import placeholder from "../../../../public/assets/images/Placeholder.png";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Position } from "@/utils/types";
import { getMimeTypeFromBase64 } from "@/utils/util";

function Body({ positions, setPositions }: any) {
  const handleAddPosition = () => {
    setPositions([
      ...positions,
      { name: "", showPictures: true, allowAbstain: true, candidates: [] },
    ]);
  };

  const handleAddCandidate = (positionIndex: number) => {
    const updatedPositions = [...positions];
    updatedPositions[positionIndex].candidates.push({
      name: "",
      nickname: "",
      details: "",
      image: [],
      media: { type: "file", data: [] },
      vote: 0,
    });
    setPositions(updatedPositions);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    positionIndex: number,
    field: keyof Position,
    candidateIndex?: number
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

  const handleShowPicture = (
    event: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number
  ) => {
    const updatedPosition = [...positions];
    updatedPosition[positionIndex].showPictures = event.target.checked;
    setPositions(updatedPosition);
  };

  const handleAllowAbstain = (
    event: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number
  ) => {
    const updatedPosition = [...positions];
    updatedPosition[positionIndex].allowAbstain = event.target.checked;
    setPositions(updatedPosition);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number,
    candidateIndex: number
  ) => {
    const { files } = e.target;

    if (files) {
      const updatedPositions = [...positions];
      const candidate =
        updatedPositions[positionIndex].candidates[candidateIndex];

      if (!candidate.image) {
        candidate.image = [];
      }

      const fileArray = Array.from(files);

      // Convert and store images as Base64 strings
      const base64Images = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result && typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              resolve("");
            }
          };
        });
      });

      // Wait for all Base64 conversions to complete
      Promise.all(base64Images).then((base64Array) => {
        candidate.image = [...candidate.image, ...base64Array];
        setPositions(updatedPositions);
      });
    }
  };

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number,
    candidateIndex: number
  ) => {
    const { files } = e.target;
    if (files && files[0]) {
      const updatedPositions = [...positions];
      const candidate =
        updatedPositions[positionIndex].candidates[candidateIndex];
      const mediaType = files[0].type.split("/")[0]; // Detect media type (file, image, or video)

      //converting to base64
      // const reader = new FileReader();
      // reader.readAsDataURL(files[0]);
      // reader.onload = (()=>{
      //   if(reader.result && typeof reader === 'string'){
      //     const base64Data = reader.result;
      //   }
      // })
      const fileArray = Array.from(files);
      const base64Images = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (reader.result && typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              resolve("");
            }
          };
        });
      });
      Promise.all(base64Images).then((base64Array) => {
        (candidate.media = {
          type: mediaType as "file" | "image" | "video",
          data: [...base64Array],
        }),
          setPositions(updatedPositions);
      });

      // candidate.media = {
      //   type: mediaType as "file" | "image" | "video",
      //   data: files[0],
      // };
    }
  };

  const handleDeleteMedia = (
    e: any,
    positionIndex: number,
    candidateIndex: number
  ) => {
    e.preventDefault();
    console.log("yay");
    const updatedPositions = [...positions];
    const candidate =
      updatedPositions[positionIndex].candidates[candidateIndex];

    if (candidate) {
      // Remove the last uploaded media

      candidate.media.data.pop();
      console.log(candidate);
      // return candidate;
    }

    setPositions(updatedPositions);
  };

  console.log(positions);

  return (
    <section className="mt-12">
      <form>
        {positions.map((position: Position, positionIndex: number) => (
          <div
            key={positionIndex}
            className="flex flex-col bg-neutral-100 rounded-lg py-10 lg:px-14 mb-10 px-4"
          >
            <div className="text-center text-slate-900 lg:text-3xl text-base font-semibold flex items-center justify-center gap-2 uppercase">
              <div>
                <img src={leftline.src} alt="line" className="w-14 lg:w-full" />
              </div>
              {position.name ? position.name : `Position ${positionIndex + 1}`}
              <div>
                <img
                  src={rightline.src}
                  alt="line"
                  className="w-14 lg:w-full"
                />
              </div>
            </div>

            <div className="flex lg:gap-10 gap-0 lg:mt-10 mt-5 items-center lg:flex-row flex-col">
              <div className="flex flex-col gap-2 w-full lg:w-auto text-sm lg:text-base">
                <label htmlFor="positionName">Name of Position</label>
                <input
                  type="text"
                  placeholder="Position Name"
                  value={position.name}
                  className="lg:w-96 w-full h-12 rounded border border-stone-900 outline-none p-4"
                  onChange={(e) => handleInputChange(e, positionIndex, "name")}
                />
              </div>
              <div className="flex lg:mt-6 mt-2 lg:gap-2 flex-wrap gap-0">
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={position.showPictures}
                        disableRipple
                        onChange={(e) => handleShowPicture(e, positionIndex)}
                        inputProps={{ "aria-label": "controlled" }}
                        sx={{
                          color: "#848484",

                          "&.Mui-checked": {
                            color: "#363636",
                          },
                        }}
                      />
                    }
                    label={
                      <span style={{ fontSize: "0.85rem" }}>
                        {" "}
                        Show Pictures
                      </span>
                    }
                  />
                </div>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={position.allowAbstain}
                        onChange={(e) => handleAllowAbstain(e, positionIndex)}
                        disableRipple
                        inputProps={{ "aria-label": "controlled" }}
                        sx={{
                          color: "#848484",
                          "&.Mui-checked": {
                            color: "#363636",
                          },
                        }}
                      />
                    }
                    label={
                      <span style={{ fontSize: "0.85rem" }}>Allow Abstain</span>
                    }
                  />
                </div>
              </div>
            </div>

            {position.candidates.map((candidate, candidateIndex) => (
              <div key={candidateIndex} className="w-full">
                <div className="mt-12 text-center lg:text-2xl text-base text-zinc-950 font-semibold capitalize">
                  {candidate.name
                    ? candidate.name
                    : `Candidate ${candidateIndex + 1}`}{" "}
                </div>
                <div
                  className={`flex items-center lg:flex-row flex-col ${
                    position.showPictures ? "gap-[42px]" : "gap-0"
                  } lg:mt-10 mt-5 `}
                >
                  {/** Handling media uploads */}
                  <div>
                    <label
                      htmlFor={`image-upload-${positionIndex}-${candidateIndex}`}
                      className="relative cursor-pointer"
                    >
                      {position.showPictures && (
                        <>
                          {candidate.image.length === 0 ? (
                            <img
                              src={placeholder.src}
                              alt="Upload Image"
                              className="max-w-[256px] w-full h-64 rounded-lg object-cover"
                            />
                          ) : (
                            <img
                              src={`${
                                candidate.image[candidate.image.length - 1]
                              }`}
                              alt={`Image for ${candidate.name}`}
                              className="max-w-[256px] w-full h-64 rounded-lg object-cover"
                            />
                          )}
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id={`image-upload-${positionIndex}-${candidateIndex}`}
                      accept="image/*"
                      style={{ display: "none" }}
                      multiple
                      onChange={(e) =>
                        handleImageUpload(e, positionIndex, candidateIndex)
                      }
                    />
                  </div>
                  {/** Handling candidate image uploads */}
                  <div className="flex-1 flex flex-col gap-10 w-full">
                    <div className="flex gap-8 lg:flex-row flex-col text-sm lg:text-base">
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="candidateName">Candidate Name</label>
                        <input
                          type="text"
                          placeholder="Candidate Name"
                          value={candidate.name}
                          className="w-full h-12 rounded border border-stone-900 outline-none p-4"
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              positionIndex,
                              "name" as keyof Position,
                              candidateIndex
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="nickname">Candidate Nickname</label>
                        <input
                          type="text"
                          placeholder="Candidate NickName"
                          value={candidate.nickname}
                          className="w-full h-12 rounded border border-stone-900 outline-none p-4"
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              positionIndex,
                              "nickname" as keyof Position,
                              candidateIndex
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="detials">More details</label>
                      <textarea
                        placeholder="Candidate Details"
                        value={candidate.details}
                        className="w-full h-36 rounded border border-stone-900 outline-none p-4"
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            positionIndex,
                            "details" as keyof Position,
                            candidateIndex
                          )
                        }
                      />
                      {/** Handling media uploads */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="application"
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={(e) =>
                            handleMediaUpload(e, positionIndex, candidateIndex)
                          }
                          style={{ display: "none" }}
                          multiple
                        />
                        <div className="image-upload">
                          {candidate.media.data.length > 0 ? (
                            candidate.media.type === "image" ? (
                              <img
                                src={`${
                                  candidate.media.data[
                                    candidate.media.data.length - 1
                                  ]
                                }`}
                                alt={`Image for ${candidate.name}`}
                                className="w-20 h-20 object-contain"
                              />
                            ) : candidate.media.type === "video" ? (
                              <video controls>
                                <source
                                  src={`${
                                    candidate.media.data[
                                      candidate.media.data.length - 1
                                    ]
                                  }`}
                                  type={getMimeTypeFromBase64(
                                    candidate.media.data[0]
                                  )}
                                />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <></>
                            )
                          ) : (
                            <label
                              htmlFor={`media-upload-${positionIndex}-${candidateIndex}`}
                              className="upload-label"
                            >
                              <span className="flex items-center gap-2 cursor-pointer">
                                Upload Media (Image, Video, PDF, DOC)
                                <span>
                                  <FaCloudUploadAlt />
                                </span>
                              </span>
                            </label>
                          )}
                          <input
                            type="file"
                            id={`media-upload-${positionIndex}-${candidateIndex}`}
                            accept="image/*,video/*,.pdf,.doc,.docx" // Accepts common media and document formats
                            onChange={(e) =>
                              handleMediaUpload(
                                e,
                                positionIndex,
                                candidateIndex
                              )
                            }
                            style={{ display: "none" }}
                            multiple
                          />
                        </div>
                        {candidate.media.data.length > 0 && (
                          <div>
                            <button
                              className="text-xl border-none outline-none bg-transparent"
                              onClick={(e) =>
                                handleDeleteMedia(
                                  e,
                                  positionIndex,
                                  candidateIndex
                                )
                              }
                            >
                              <MdDelete />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/** Handling media uploads */}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="button"
                className="mt-12 lg:text-xl text-base font-semibold text-blue-700 w-48 h-12 flex items-center justify-center gap-2.5 rounded-lg outline-none border-2 border-blue-700"
                onClick={() => handleAddCandidate(positionIndex)}
              >
                <span>Add Candidate</span>
                <span>+</span>
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddPosition}
            className="w-44 h-12 flex justify-center items-center bg-blue-700 gap-2.5 text-zinc-100 lg:text-xl text-base font-semibold outline-none rounded-lg"
          >
            <span>+</span>
            <span>Add Position</span>
          </button>
        </div>

        {/* <button type="submit">Submit</button> */}
      </form>
    </section>
  );
}

export default Body;
