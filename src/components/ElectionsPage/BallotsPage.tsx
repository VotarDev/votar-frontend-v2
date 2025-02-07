import React, { useState, useEffect, useRef } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { deleteCandidate, deletePosition, getElectionById } from "@/utils/api";
import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import Header from "../BallotPage/Header";
import { useRouter } from "next/router";
import { getCandidates } from "@/utils/api";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import leftline from "../../../public/assets/images/left-line.svg";
import placeholder from "../../../public/assets/images/Placeholder.png";
import rightline from "../../../public/assets/images/right-line.svg";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoCopy } from "react-icons/io5";
import { AiOutlineEye, AiOutlineLink } from "react-icons/ai";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";

import DeletePositionDialog from "./DeletePositionModal";
import DeleteCandidateDialog from "./DeleteCandidateModal";

const BallotsPage = ({ position, setPosition }: any) => {
  const users = useCurrentUser();
  const router = useRouter();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [electionID, setElectionID] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const textRef = useRef<HTMLElement | null>(null);
  const [deleteCandidateModal, setDeleteCandidateModal] = useState(false);
  const [deletePositionModal, setDeletePositionModal] = useState(false);
  const [isDeletePositionLoading, setIsDeletePositionLoading] = useState(false);
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        if (electionID) {
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);

            const { start_date } = data.data;
            const combinedDateTime = new Date(start_date);

            if (!isNaN(combinedDateTime.getTime())) {
              setTargetDateTime(combinedDateTime);
            } else {
              console.error("Invalid start_date format:", start_date);
            }
            console.log(start_date);
            setIsLoading(false);
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message);
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    if (targetDateTime) {
      const updateEditableState = () => {
        const now = new Date();
        setIsEditable(now < targetDateTime);
      };

      // Initial check
      updateEditableState();

      // set an interval to keep updating
      const interval = setInterval(updateEditableState, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const fetchData = async () => {
    try {
      if (electionID) {
        const electionIdData = { election_id: electionID };
        const { data } = await getCandidates(USER_ID, electionIdData);
        if (data) {
          setPosition(data.data);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [electionID]);

  const handleInputChange = (
    e: any,
    positionIndex: any,
    key: any,
    candidateIndex = null
  ) => {
    const { name, value } = e.target;
    setPosition((prevPositions: any) => {
      const updatedPositions = [...prevPositions];
      if (candidateIndex !== null) {
        updatedPositions[positionIndex].candidates[candidateIndex][key] = value;
      } else {
        updatedPositions[positionIndex][key] = value;
      }
      return updatedPositions;
    });
  };

  const handleShowPicture = (e: any, positionIndex: any) => {
    const { checked } = e.target;
    setPosition((prevPositions: any) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[positionIndex].show_pictures = checked;
      return updatedPositions;
    });
  };

  const handleAllowAbstain = (e: any, positionIndex: any) => {
    const { checked } = e.target;
    setPosition((prevPositions: any) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[positionIndex].allow_abstain = checked;
      return updatedPositions;
    });
  };

  const handleImageUpload = (
    e: any,
    positionIndex: any,
    candidateIndex: any
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const updatedPositions = [...position];
      const candidate =
        updatedPositions[positionIndex].candidates[candidateIndex];

      candidate.candidate_picture = file;
      candidate.filename = file.name;

      setPosition(updatedPositions);
    }
  };

  const handleAddCandidate = (positionIndex: any) => {
    const updatedPositions = [...position];
    updatedPositions[positionIndex].candidates.push({
      candidate_name: "",
      candidate_nickname: "",
      candidate_picture: null,
      media: "",
      votes: 0,
      _id: Date.now().toString(),
    });
    setPosition(updatedPositions);
  };

  const handleAddPosition = () => {
    setPosition((prevPositions: any) => [
      ...prevPositions,
      {
        name_of_position: "",
        show_pictures: false,
        allow_abstain: false,
        candidates: [],
        election_id: electionID,
        __v: 0,
        author_id: USER_ID,
      },
    ]);
  };
  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    positionIndex: number,
    candidateIndex: number
  ) => {
    const { files } = e.target;
    if (files && files[0]) {
      const updatedPositions = [...position];
      const candidate =
        updatedPositions[positionIndex].candidates[candidateIndex];
      const mediaType = files[0].type.split("/")[0];

      candidate.media = {
        type: mediaType as "file" | "image" | "video",
        docs: files[0],
      };
      candidate.docsname = files[0].name;

      setPosition(updatedPositions);
    }
  };

  const handleDeleteMedia = (
    e: any,
    positionIndex: any,
    candidateIndex: any
  ) => {
    e.preventDefault();
    setPosition((prevPositions: any) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[positionIndex].candidates[candidateIndex].media = "";
      return updatedPositions;
    });
  };

  const handleCopyClick = async () => {
    if (textRef.current) {
      const selectedText = textRef.current.innerText;
      try {
        await navigator.clipboard.writeText(selectedText);

        toast.success("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };

  const handleDeleteCandidate = async (
    e: any,
    positionName: string,
    candidateName: string
  ) => {
    e.preventDefault();
    try {
      const dataBody = {
        election_id: electionID,
        name_of_position: positionName,
        candidate_name: candidateName,
      };
      const { data } = await deleteCandidate(dataBody);
      if (data) {
        toast.success("Deleted Successfully");
        fetchData();
      }
      console.log(dataBody);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error);
      toast.error(error.response.data.message || error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="my-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  if (error) {
    return <div className="my-10">{error}</div>;
  }

  return (
    <div className="my-[60px]">
      <Header electionDetails={election} />
      <div className="lg:mt-10 mt-5 flex lg:justify-end items-center lg:gap-10 gap-2 flex-wrap justify-center">
        <div className="flex items-center gap-4 lg:text-xl text-base text-blue-700 font-semibold">
          <div>
            Election ID: <span ref={textRef}>{election?.election_id}</span>
          </div>
          <div onClick={handleCopyClick} className="cursor-pointer">
            <IoCopy />
          </div>
        </div>
        <div className="flex lg:gap-7 gap-2 flex-wrap justify-center">
          <div>
            <button className="lg:w-56 w-full lg:h-14 h-10 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-xl text-xs text-blue-700 font-semibold p-4 lg:p-0">
              <span>
                <AiOutlineLink />
              </span>
              Copy Election Link
            </button>
          </div>
          <div>
            <Link
              href={`/preview-election/${election?.election_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="lg:w-48 lg:h-14 h-10 w-full bg-blue-700 rounded-lg border border-zinc-100 justify-center items-center gap-4 flex lg:text-xl text-xs p-4 font-semibold text-zinc-100 lg:p-0">
                <span>
                  <AiOutlineEye />
                </span>
                Preview Ballot
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <form>
          {position.map((position: any, positionIndex: any) => (
            <div
              key={positionIndex}
              className="flex flex-col bg-neutral-100 rounded-lg py-10 lg:px-14 mb-10 px-4 relative"
            >
              {positionIndex > 0 && (
                <div className="absolute -right-1 -top-4 text-3xl">
                  {/* <button
                    className="text-red-500"
                    // onClick={(e) =>
                    //   handleDeletePosition(e, position.name_of_position)
                    // }
                    onClick={(e) => handleOpenPositionModal(e)}
                  >
                    <MdDelete />
                  </button> */}
                  <DeletePositionDialog
                    selectedPosition={position.name_of_position}
                    id={electionID}
                    userId={USER_ID}
                    getUpdatedList={() => fetchData()}
                  />
                </div>
              )}
              <div className="text-center text-slate-900 lg:text-3xl text-base font-semibold flex items-center justify-center gap-2 uppercase">
                <div>
                  <img
                    src={leftline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
                {position.name_of_position
                  ? position.name_of_position
                  : `Position ${positionIndex + 1}`}
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
                    value={position.name_of_position}
                    disabled={!isEditable}
                    className="lg:w-96 w-full h-12 rounded border border-stone-900 outline-none p-4"
                    onChange={(e) =>
                      handleInputChange(e, positionIndex, "name_of_position")
                    }
                  />
                </div>
                <div className="flex lg:mt-6 mt-2 lg:gap-2 flex-wrap gap-0">
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={position.show_pictures}
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
                          Show Pictures{" "}
                        </span>
                      }
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={position.allow_abstain}
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
                        <span style={{ fontSize: "0.85rem" }}>
                          Allow Abstain
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>

              {position.candidates.map(
                (candidate: any, candidateIndex: any) => (
                  <div key={candidateIndex} className="w-full relative">
                    <div className="absolute right-0 top-5 text-red-500 text-3xl">
                      {/* <button
                        className="flex items-center"
                        onClick={(e) =>
                          handleDeleteCandidate(
                            e,
                            position.name_of_position,
                            candidate.candidate_name
                          )
                        }
                      >
                        <span>
                          <MdDelete />
                        </span>
                        <span className="text-sm">Delete candidate</span>
                      </button> */}
                      <DeleteCandidateDialog
                        selectedPosition={position.name_of_position}
                        selectedCandidate={candidate.candidate_name}
                        id={electionID}
                        userId={USER_ID}
                        getUpdatedList={() => fetchData()}
                      />
                    </div>
                    <div className="mt-12 text-center lg:text-2xl text-base text-zinc-950 font-semibold capitalize">
                      {candidate.candidate_name
                        ? candidate.candidate_name
                        : `Candidate ${candidateIndex + 1}`}{" "}
                    </div>
                    <div
                      className={`flex items-center lg:flex-row flex-col ${
                        position.show_pictures ? "gap-[42px]" : "gap-0"
                      } lg:mt-10 mt-5 `}
                    >
                      <div>
                        <label
                          htmlFor={`image-upload-${positionIndex}-${candidateIndex}`}
                          className={`relative cursor-pointer ${
                            !isEditable &&
                            "filter grayscale pointer-events-none"
                          }`}
                        >
                          {position.show_pictures && (
                            <>
                              {candidate.candidate_picture === null ? (
                                <img
                                  src={placeholder.src}
                                  alt="Upload Image"
                                  className={`max-w-[256px] w-full h-64 rounded-lg object-cover `}
                                />
                              ) : (
                                <img
                                  src={`${
                                    typeof candidate.candidate_picture ===
                                    "string"
                                      ? candidate.candidate_picture
                                      : URL.createObjectURL(
                                          candidate.candidate_picture
                                        )
                                  }`}
                                  alt={`Image for ${candidate.candidate_name}`}
                                  className={`max-w-[256px] w-full h-64 rounded-lg object-cover `}
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
                          onChange={(e) =>
                            handleImageUpload(e, positionIndex, candidateIndex)
                          }
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-10 w-full">
                        <div className="flex gap-8 lg:flex-row flex-col text-sm lg:text-base">
                          <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="candidateName">
                              Candidate Name
                            </label>
                            <input
                              type="text"
                              placeholder="Candidate Name"
                              value={candidate.candidate_name}
                              disabled={!isEditable}
                              className="w-full h-12 rounded border border-stone-900 outline-none p-4"
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  positionIndex,
                                  "candidate_name",
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
                              value={candidate.candidate_nickname}
                              disabled={!isEditable}
                              className="w-full h-12 rounded border border-stone-900 outline-none p-4"
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  positionIndex,
                                  "candidate_nickname",
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
                            value={candidate.more_details}
                            disabled={!isEditable}
                            className="w-full h-36 rounded border border-stone-900 outline-none p-4"
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                positionIndex,
                                "more_details",
                                candidateIndex
                              )
                            }
                          />
                          <div className="flex gap-2 items-center">
                            <input
                              type="file"
                              id={`media-upload-${positionIndex}-${candidateIndex}`}
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              disabled={!isEditable}
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
                            <div>
                              {candidate.media &&
                                typeof candidate.media === "string" && (
                                  <>
                                    <img
                                      src={candidate.media}
                                      alt={candidate.candidate_name}
                                      className="w-20 h-20 object-contain"
                                    />
                                  </>
                                )}
                            </div>
                            <div className="image-upload">
                              {candidate.media ? (
                                candidate.media.type === "image" ? (
                                  <img
                                    src={`${
                                      typeof candidate.media === "string"
                                        ? candidate.media
                                        : URL.createObjectURL(
                                            candidate.media.docs
                                          )
                                    }`}
                                    alt={`Image for ${candidate.candidate_name}`}
                                    className="w-20 h-20 object-contain"
                                  />
                                ) : candidate.media.type === "video" ? (
                                  <video
                                    controls
                                    className="w-20 h-20 object-contain"
                                  >
                                    <source
                                      src={`${
                                        typeof candidate.media === "string"
                                          ? candidate.media
                                          : URL.createObjectURL(
                                              candidate.media.docs
                                            )
                                      }`}
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
                                  <span
                                    className={`flex items-center gap-2 cursor-pointer `}
                                  >
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
                                accept="image/*,video/*,.pdf,.doc,.docx"
                                disabled={!isEditable}
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
                            {candidate.media && (
                              <div>
                                <button
                                  className={`text-xl border-none outline-none bg-transparent `}
                                  disabled={!isEditable}
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
                      </div>
                    </div>
                  </div>
                )
              )}
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
        </form>
      </div>
    </div>
  );
};

export default BallotsPage;
