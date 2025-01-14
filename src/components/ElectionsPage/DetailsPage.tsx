import React, { useState, useEffect } from "react";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { DetailFormState, ElectionDetails, OptionTypes } from "@/utils/types";
import { CircularProgress } from "@mui/material";

import { useSelector } from "react-redux";

import { FaCaretDown } from "react-icons/fa";
import calendar from "../../../public/assets/icons/calendar-2.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import { formatDateToISO, formatTimeToHHMM } from "@/utils/util";

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
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);

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
          const electionData = { election_id: electionId };
          const { data } = await getElectionById(electionData);

          if (data) {
            setElection(data.data);
            dispatch({ type: "SET_ELECTION", value: data.data });
            const { start_date } = data.data;
            const combinedDateTime = new Date(start_date);
            if (!isNaN(combinedDateTime.getTime())) {
              setTargetDateTime(combinedDateTime);
            } else {
              console.error("Invalid start_date format:", start_date);
            }
            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
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

      // Initial check
      updateEditableState();

      // set an interval to keep updating
      const interval = setInterval(updateEditableState, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const primaryColors: OptionTypes[] = [
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
  ];

  const secondaryColors: OptionTypes[] = [
    { value: "orange", label: "Orange" },
    { value: "green", label: "Green" },
    { value: "violet", label: "Violet" },
  ];

  const handleCandidateNo = () => {
    dispatch({ type: "INCREMENT_CANDIDATE_NO", value: 1 });
  };
  const decreaseCanditateNo = () => {
    dispatch({ type: "DECREMENT_CANDIDATE_NO", value: 1 });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_date" && state.end_date) {
      // Validate that start_date is not greater than end_date
      if (new Date(value) > new Date(state.end_date)) {
        toast.error("Start date cannot be later than end date!");
        return; // Prevent dispatch if validation fails
      }
    }

    if (name === "end_date" && state.start_date) {
      // Validate that end_date is not less than start_date
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

  const votingPriceIncrement = () => {
    setPricePerVote(pricePerVote + 1);
  };
  const votingPriceDecrement = () => {
    if (pricePerVote > 0) {
      setPricePerVote(pricePerVote - 1);
    }
  };

  console.log(election?.start_date, election?.start_time);

  return (
    <div>
      {isFecthElection ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      ) : (
        <div className="lg:my-[60px] my-10">
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
                    election?.association_logo ? "lg:mt-0 mt-3" : "mt-[40px]"
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
                    {election?.association_logo && (
                      <div>
                        <img
                          src={election?.association_logo}
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
                        {primaryColor ?? election?.primary_color}
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
                        <div className="absolute bg-white w-full rounded mt-1 shadow-md z-10 capitalize">
                          {primaryColors.map((color, index) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#ccc]"
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
                              {color.value}
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
                        {secondaryColor ?? election?.secondary_color}
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
                        <div className="absolute bg-white w-full rounded mt-1 shadow-md z-10 capitalize">
                          {secondaryColors.map((color, index) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#ccc]"
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
                              {color.value}
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
                    id="time"
                    onChange={handleChange}
                    value={
                      state.start_time || formatTimeToHHMM(election?.start_time)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                  <label htmlFor="time">Input end time</label>
                  <input
                    type="time"
                    name="end_time"
                    className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                    id="time"
                    value={
                      state.end_time || formatTimeToHHMM(election?.end_time)
                    }
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
                  {!monetizeElection && (
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
                          value={pricePerVote}
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
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
