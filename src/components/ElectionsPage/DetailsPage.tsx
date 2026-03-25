import React, { useState, useEffect, useCallback } from "react";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { DetailFormState, ElectionDetails, OptionTypes } from "@/utils/types";
import { CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";
import getCroppedImg from "@/utils/cropImage";
import Cropper from "react-easy-crop";
import { FaCaretDown } from "react-icons/fa";
import calendar from "../../../public/assets/icons/calendar-2.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import { formatDateToISO } from "@/utils/util";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import { PiArrowLeft } from "react-icons/pi";

const formatTimeToHHMM = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const DetailsPage = ({
  electionId,
  state,
  dispatch,
}: {
  electionId: string;
  userId: string;
  state: any;
  dispatch: any;
}) => {
  const users = useCurrentUser();
  const user = useUser();
  const [electionID, setElectionID] = useState("");
  const [isFecthElection, setIsFetchElection] = useState(false);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [primaryColorToggle, setPrimaryColorToggle] = useState(false);
  const [secondaryColorToggle, setSecondaryColorToggle] = useState(false);
  const { votarPlan } = useSelector((state: any) => state.votarPlan);
  const [candidateNo, setCandidateNo] = useState(0);
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(null);
  const [pricePerVote, setPricePerVote] = useState(0);
  const [monetizeElection, setMonetizeElection] = useState(false);
  const [numberofFreeVote, setNumberofFreeVote] = useState(0);
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [rotation, setRotation] = useState(0);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      if (!croppedImage) {
        throw new Error("Cropped image is null");
      }

      const blobUrl = URL.createObjectURL(croppedImage);

      dispatch({
        type: "SET_BACKGROUND_IMAGE",
        background_image: croppedImage,
        background_image_preview: blobUrl,
      });

      setShowCropModal(false);
    } catch (error) {
      toast.error("Failed to crop image. Please try again.");
    }
  };

  useEffect(() => {
    const getElection = async () => {
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }

      setIsFetchElection(true);

      try {
        if (electionId) {
          const { data } = await getElectionById({ election_id: electionId });

          if (data) {
            const electionData = data.data;
            setElection(electionData);
            dispatch({ type: "SET_ELECTION", value: electionData });

            // Set editable datetime for countdown
            const start = new Date(electionData.start_date);
            setTargetDateTime(start);

            // Dispatch the times to the main state
            dispatch({
              type: "SET_FIELD",
              field: "start_time",
              value: formatTimeToHHMM(electionData.start_date),
            });

            dispatch({
              type: "SET_FIELD",
              field: "end_time",
              value: formatTimeToHHMM(electionData.end_date),
            });

            setIsFetchElection(false);
          }
        }
      } catch (e) {
        setIsFetchElection(false);
        console.log(e);
      }
    };

    getElection();
  }, [electionId]);

  useEffect(() => {
    if (targetDateTime) {
      const updateEditableState = () => {
        const now = new Date();
        setIsEditable(now < targetDateTime);
      };

      updateEditableState();

      const interval = setInterval(updateEditableState, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const colorOptions: OptionTypes[] = [
    { value: "#EF4444", label: "Red" },
    { value: "#F97316", label: "Orange" },
    { value: "#F59E0B", label: "Amber" },
    { value: "#EAB308", label: "Yellow" },
    { value: "#84CC16", label: "Lime" },
    { value: "#22C55E", label: "Green" },
    { value: "#10B981", label: "Emerald" },
    { value: "#14B8A6", label: "Teal" },
    { value: "#06B6D4", label: "Cyan" },
    { value: "#0EA5E9", label: "Sky Blue" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#6366F1", label: "Indigo" },
    { value: "#8B5CF6", label: "Violet" },
    { value: "#A855F7", label: "Purple" },
    { value: "#D946EF", label: "Fuchsia" },
    { value: "#EC4899", label: "Pink" },
    { value: "#F43F5E", label: "Rose" },
    { value: "#1E3A5F", label: "Navy" },
    { value: "#064E3B", label: "Forest Green" },
    { value: "#7C2D12", label: "Brown" },
    { value: "#1E1E1E", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#64748B", label: "Slate" },
    { value: "#9CA3AF", label: "Gray" },
    { value: "#FDE68A", label: "Pale Yellow" },
    { value: "#FECACA", label: "Light Pink" },
    { value: "#BBF7D0", label: "Mint" },
    { value: "#BAE6FD", label: "Light Blue" },
    { value: "#DDD6FE", label: "Lavender" },
  ];

  const primaryColors = colorOptions;
  const secondaryColors = colorOptions;

  const handleCandidateNo = (e: any) => {
    e.preventDefault();
    dispatch({ type: "INCREMENT_CANDIDATE_NO", value: 1 });
  };
  const decreaseCanditateNo = (e: any) => {
    e.preventDefault();
    dispatch({ type: "DECREMENT_CANDIDATE_NO", value: 1 });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_date" && state.end_date) {
      if (new Date(value) > new Date(state.end_date)) {
        toast.error("Start date cannot be later than end date!");
        return;
      }
    }

    if (name === "end_date" && state.start_date) {
      if (new Date(value) < new Date(state.start_date)) {
        toast.error("End date cannot be earlier than start date!");
        return;
      }
    }
    dispatch({
      type: "SET_FIELD",
      field: name as keyof DetailFormState,
      value: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        toast.error("File size exceeds 100kb. Please select a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: "SET_IMAGE",
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        toast.error("File size exceeds 100kb. Please select a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const votingPriceIncrement = (e: any) => {
    e.preventDefault();
    setPricePerVote(pricePerVote + 1);
    dispatch({
      type: "INCREMENT_PRICE_PER_VOTE",
      value: 1,
    });
  };
  const votingPriceDecrement = (e: any) => {
    e.preventDefault();
    if (pricePerVote > 0) {
      setPricePerVote(pricePerVote - 1);
    }
    dispatch({
      type: "DECREMENT_PRICE_PER_VOTE",
      value: 1,
    });
  };

  const numberofFreeVoteIncrement = (e: any) => {
    e.preventDefault();
    setNumberofFreeVote(numberofFreeVote + 1);
    dispatch({
      type: "INCREMENT_FREE_VOTE",
      value: 1,
    });
  };

  const numberofFreeVoteDecrement = (e: any) => {
    e.preventDefault();
    if (numberofFreeVote > 0) {
      setNumberofFreeVote(numberofFreeVote - 1);
    }
    dispatch({
      type: "DECREMENT_FREE_VOTE",
      value: 1,
    });
  };

  return (
    <div>
      {isFecthElection ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      ) : (
        <div className="lg:my-[40px] my-10">
          <div className="mb-6">
            <button
              className=" py-2 text-blue-700 rounded flex items-center justify-center gap-2 font-semibold"
              onClick={() => window.history.back()}
            >
              <PiArrowLeft /> Back
            </button>
          </div>
          <div className="text-2xl font-semibold">Election Details</div>
          <div className="mt-[30px]">
            <form className="font-semibold" encType="multipart/form-data">
              <div className="flex flex-col gap-1">
                <label htmlFor="electionName">Name of Election</label>
                <input
                  type="text"
                  name="electionName"
                  className="lg:w-[498px] h-[48px] p-4 rounded border border-[#1E1E1E] outline-none w-full"
                  value={state.electionName || election?.name_of_election}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 mt-[40px]">
                <label htmlFor="otherDetails">Other Details For Election</label>
                <textarea
                  className="lg:w-[498px] w-full border border-[#1E1E1E] rounded outline-none p-3 h-[150px]"
                  name="description"
                  value={state.description || election?.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mt-[40px] flex items-center lg:text-xl text-base font-normal w-full flex-wrap gap-2">
                <div className="mr-2">
                  <label htmlFor="image">
                    Upload Association Logo for Election:
                  </label>
                </div>
                <div>
                  <input
                    name="image"
                    type="file"
                    accept=".png, .svg, .jpg, .jpeg,"
                    className="hidden"
                    id="file-input"
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <label
                    htmlFor="file-input"
                    className="p-2 border bg-[#015CE9] rounded-lg text-white mr-1 cursor-pointer"
                  >
                    Choose File:
                  </label>
                </div>

                <div>
                  {election?.association_logo && (
                    <div className="">
                      <img
                        src={state.imagePreview || election?.association_logo}
                        alt="logo"
                        className="lg:w-[90px] lg:h-[90px] object-contain w-14 h-14 "
                      />
                    </div>
                  )}
                </div>
              </div>
              {election?.type === "Free Votar" && (
                <div
                  className={`${
                    election?.elect_background_img
                      ? "lg:mt-0 mt-3"
                      : "mt-[40px]"
                  } flex items-center lg:text-xl text-base font-normal flex-wrap gap-2`}
                >
                  <div className="mr-2">
                    <label htmlFor="image">
                      Upload Background Image for Election:
                    </label>
                  </div>
                  <div>
                    <input
                      name="image"
                      type="file"
                      accept=".png, .svg, .jpg, .jpeg,"
                      className="hidden"
                      id="file-input2"
                      onChange={handleBackgroundImageUpload}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="file-input2"
                      className="p-2 border bg-[#015CE9] rounded-lg text-white mr-1 cursor-pointer"
                    >
                      Choose File:
                    </label>
                  </div>

                  <div>
                    {(election?.elect_background_img ||
                      state.background_image_preview) && (
                      <div>
                        <img
                          src={
                            state.background_image_preview ||
                            election?.elect_background_img
                          }
                          alt="logo"
                          className="lg:w-[100px] lg:h-[100px] object-contain w-14 h-14"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {election?.type === "Votar Pro" && (
                <div className="mt-[44px] flex gap-10 lg:flex-row flex-col">
                  <div className="flex flex-col gap-1 w-full lg:w-auto">
                    <div>Choose Primary Background Color</div>
                    <div className="relative">
                      <div
                        className="lg:w-[348px] h-[48px] w-full border cursor-pointer border-[#1e1e1e] rounded flex items-center justify-between relative p-4 capitalize"
                        onClick={() =>
                          setPrimaryColorToggle(!primaryColorToggle)
                        }
                      >
                        <span className="flex items-center gap-2">
                          {(primaryColor ?? election?.primary_color) && (
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: primaryColor ?? election?.primary_color }}
                            />
                          )}
                          {colorOptions.find(c => c.value === (primaryColor ?? election?.primary_color))?.label ?? (primaryColor ?? election?.primary_color)}
                        </span>
                        <span
                          className={`text-2xl ${
                            primaryColorToggle
                              ? "-rotate-90 transition-all ease "
                              : ""
                          }`}
                        >
                          <FaCaretDown />
                        </span>
                      </div>
                      {primaryColorToggle && (
                        <div className="absolute bg-white w-full rounded mt-1 shadow-md z-10 capitalize overflow-y-auto max-h-48">
                          {primaryColors.map((color, index) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#f0f0f0] flex items-center gap-2"
                              key={index}
                              onClick={() => {
                                setPrimaryColor(color.value);
                                dispatch({
                                  type: "SET_PRIMARY_COLOR",
                                  value: color.value,
                                });
                                setPrimaryColorToggle(false);
                              }}
                            >
                              <span
                                className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full lg:w-auto">
                    <div>Choose Secondary Background Color</div>
                    <div className="relative">
                      <div
                        className="lg:w-[348px] h-[48px] w-full border cursor-pointer border-[#1e1e1e] rounded flex items-center justify-between relative p-4 capitalize"
                        onClick={() =>
                          setSecondaryColorToggle(!secondaryColorToggle)
                        }
                      >
                        <span className="flex items-center gap-2">
                          {(secondaryColor ?? election?.secondary_color) && (
                            <span
                              className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                              style={{ backgroundColor: secondaryColor ?? election?.secondary_color }}
                            />
                          )}
                          {colorOptions.find(c => c.value === (secondaryColor ?? election?.secondary_color))?.label ?? (secondaryColor ?? election?.secondary_color)}
                        </span>
                        <span
                          className={`text-2xl ${
                            secondaryColorToggle
                              ? "-rotate-90 transition-all ease "
                              : ""
                          }`}
                        >
                          <FaCaretDown />
                        </span>
                      </div>
                      {secondaryColorToggle && (
                        <div className="absolute bg-white w-full rounded mt-1 shadow-md z-10 capitalize overflow-y-auto max-h-48">
                          {secondaryColors.map((color, index) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#f0f0f0] flex items-center gap-2"
                              key={index}
                              onClick={() => {
                                setSecondaryColor(color.value);
                                dispatch({
                                  type: "SET_SECONDARY_COLOR",
                                  value: color.value,
                                });
                                setSecondaryColorToggle(false);
                              }}
                            >
                              <span
                                className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-[34px] flex gap-10 lg:flex-row flex-col">
                <div className=" flex flex-col gap-1 w-full lg:w-auto">
                  <label htmlFor="date">Choose start date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="start_date"
                      className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                      value={
                        state.start_date ||
                        formatDateToISO(election?.start_date)
                      }
                      onChange={handleChange}
                    />
                    <span className="absolute right-4 bg-white top-1/2 -translate-y-1/2 pointer-events-none">
                      <img src={calendar.src} alt="calendar" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                  <label htmlFor="date">Choose end date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="end_date"
                      className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                      value={
                        state.end_date || formatDateToISO(election?.end_date)
                      }
                      onChange={handleChange}
                    />
                    <span className="absolute right-4 bg-white top-1/2 -translate-y-1/2 pointer-events-none">
                      <img src={calendar.src} alt="calendar" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-[34px] flex gap-10 flex-col lg:flex-row">
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                  <label htmlFor="time">Input start time</label>
                  <input
                    type="time"
                    name="start_time"
                    className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                    value={state.start_time}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                  <label htmlFor="time">Input end time</label>
                  <input
                    type="time"
                    name="end_time"
                    className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                    value={state.end_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-[34px] flex lg:gap-10 items-center flex-wrap gap-4">
                <div className="lg:text-xl text-base font-normal">
                  Max Number of Candidates to be Selected Per Position
                </div>
                <div className="flex items-center gap-4 text-2xl">
                  <button
                    className={`w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer ${
                      election?.max_number_candidate == 0
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-1 cursor-pointer"
                    }`}
                    onClick={decreaseCanditateNo}
                    disabled={!isEditable}
                  >
                    <AiOutlineMinus />
                  </button>
                  <input
                    type="text"
                    value={state.max_number_candidate}
                    className="w-10 outline-none text-center"
                    onChange={handleChange}
                  />
                  <button
                    className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                    onClick={handleCandidateNo}
                    disabled={!isEditable}
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>
              {/* <div className="mt-5">
                <button
                  disabled={isProcessing}
                  className="w-40 h-12 flex items-center justify-center bg-blue-700 outline-none border-none text-lg text-white rounded-lg"
                >
                  {isProcessing && (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      className="text-white mr-2 "
                    />
                  )}
                  Edit Election
                </button>
              </div> */}

              {election?.type === "Free Votar" && (
                <div>
                  <div className="mt-[34px] flex lg:gap-10 items-center flex-wrap gap-4">
                    <div className="lg:text-xl text-base font-normal">
                      Number of Free Votes
                    </div>
                    <div className="flex items-center gap-4 text-2xl">
                      <div
                        className={`w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer ${
                          numberofFreeVote == 0
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-1 cursor-pointer"
                        }`}
                        onClick={numberofFreeVoteDecrement}
                      >
                        <AiOutlineMinus />
                      </div>
                      <input
                        type="text"
                        value={state.free_votes || numberofFreeVote}
                        className="w-10 outline-none text-center"
                      />
                      <div
                        className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                        onClick={numberofFreeVoteIncrement}
                      >
                        <AiOutlinePlus />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[34px]">
                    <div className=" flex items-center gap-4">
                      <h2 className="lg:text-xl text-base font-bold">
                        Monetize Election
                      </h2>
                      <input
                        type="checkbox"
                        name="monetize"
                        onChange={() => setMonetizeElection(!monetizeElection)}
                      />
                    </div>
                    {monetizeElection && (
                      <div className="mt-5 flex  items-center flex-wrap gap-4 lg:gap-10">
                        <div className="lg:text-xl text-base font-normal ">
                          Price per Vote
                        </div>
                        <div className="flex items-center gap-4 text-2xl">
                          <button
                            className={`w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer ${
                              pricePerVote == 0
                                ? "opacity-50 cursor-not-allowed"
                                : "opacity-1 cursor-pointer"
                            }`}
                            onClick={votingPriceDecrement}
                          >
                            <AiOutlineMinus />
                          </button>
                          <input
                            type="text"
                            value={state.price_per_vote || pricePerVote}
                            className="w-10 outline-none text-center"
                          />
                          <button
                            className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                            onClick={votingPriceIncrement}
                          >
                            <AiOutlinePlus />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCropModal && (
          <Modal key="modal" handleClose={() => setShowCropModal(false)}>
            <div className="bg-white p-4 rounded-lg w-96">
              <h2 className="text-lg font-semibold mb-4">Crop Your Image</h2>
              <div className="relative w-full h-[200px]">
                <Cropper
                  image={imageSrc || undefined}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  onClick={() => setShowCropModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleCropSave}
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* {showCropModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Crop Your Image</h2>

            <Cropper
              image={imageSrc || undefined}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                onClick={() => setShowCropModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleCropSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DetailsPage;
