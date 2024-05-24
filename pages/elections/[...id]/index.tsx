import DashboardLayout from "@/src/components/DashboardLayout";
import React, { useState, useEffect, useReducer } from "react";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { ElectionDetails, OptionTypes } from "@/utils/types";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { updateElection } from "@/utils/api";
import { FaCaretDown } from "react-icons/fa";
import calendar from "../../../public/assets/icons/calendar-2.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/util";

interface FormState {
  electionName: string;
  description: string;
  primary_color: string;
  secondary_color: string;
  image: File | null;
  imagePreview: string | null;
  start_date: string | undefined;
  end_date: string | undefined;
  start_time: string | number | undefined;
  end_time: string | undefined | number;
  max_number_candidate: number;
}

type Action =
  | { type: "SET_FIELD"; field: keyof FormState; value: string }
  | { type: "SET_IMAGE"; image: File; imagePreview: string }
  | { type: "SET_PRIMARY_COLOR"; value: string }
  | { type: "SET_SECONDARY_COLOR"; value: string }
  | { type: "SET_CANDIDATE_NO"; value: number }
  | { type: "SET_ELECTION"; value: ElectionDetails };

const formatDateToISO = (dateString: string | undefined) => {
  if (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

const formatTimeToHHMM = (timestamp: number | undefined) => {
  if (timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
};

const ElectionDetail = () => {
  const router = useRouter();
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
  const initState: FormState = {
    electionName: "",
    description: "",
    primary_color: "",
    secondary_color: "",
    image: null,
    imagePreview: null,
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    max_number_candidate: 0,
  };
  const [state, dispatch] = useReducer(reducer, initState);
  const [isProcessing, setIsProcessing] = useState(false);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);

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
        if (typeof window !== "undefined") {
          const electionId = localStorage.getItem("ElectionId");
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData, USER_ID);
          if (data) {
            setElection(data.data);
            dispatch({ type: "SET_ELECTION", value: data.data });
            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getElection();
  }, [electionID, users, user]);

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
    setCandidateNo(candidateNo + 1);
  };
  const decreaseCanditateNo = () => {
    if (candidateNo > 0) {
      setCandidateNo(candidateNo - 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: "SET_FIELD",
      field: name as keyof FormState,
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

  function reducer(state: FormState, action: Action): FormState {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_IMAGE":
        return {
          ...state,
          image: action.image,
          imagePreview: URL.createObjectURL(action.image),
        };
      case "SET_PRIMARY_COLOR":
        return { ...state, primary_color: action.value };
      case "SET_SECONDARY_COLOR":
        return { ...state, secondary_color: action.value };
      case "SET_CANDIDATE_NO":
        return { ...state, max_number_candidate: action.value };
      case "SET_ELECTION":
        return {
          ...state,
          electionName: action.value.name_of_election,
          description: action.value.description,
          primary_color: action.value.primary_color,
          secondary_color: action.value.secondary_color,
          start_date: formatDateToISO(action.value.start_date),
          end_date: formatDateToISO(action.value.end_date),
          start_time: formatTimeToHHMM(Number(action.value.start_time || "")),
          end_time: formatTimeToHHMM(Number(action.value.end_time || "")),
          max_number_candidate: action.value.max_number_candidate,
        };
      default:
        return state;
    }
  }

  const handleEditElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const [startDateString] = state.start_date
      ? state?.start_date.split(" ")
      : [""];
    const [endDateString] = state.end_date ? state.end_date.split(" ") : [""];
    const [startYear, startMonth, startDay] = startDateString.split("-");
    const [endYear, endMonth, endDay] = endDateString.split("-");
    const formattedStartDate = formatDate(startYear, startMonth, startDay);
    const formattedEndDate = formatDate(endYear, endMonth, endDay);
    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else {
      if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }
    }
    const formData = new FormData();
    formData.append("name_of_election", state.electionName);
    formData.append("description", state.description);
    formData.append("primary_color", state.primary_color);
    formData.append("secondary_color", state.secondary_color);
    formData.append("start_date", formattedStartDate);
    formData.append("end_date", formattedEndDate);
    if (state.start_time)
      formData.append("start_time", String(state.start_time));
    if (state.end_time) formData.append("end_time", String(state.end_time));
    formData.append("election_id", electionID);
    formData.append(
      "max_number_candidate",
      state.max_number_candidate.toString()
    );
    if (state.image) {
      formData.append("election-image", state.image);
    }
    try {
      const { data } = await updateElection(formData, USER_ID);

      if (data) {
        toast.success("Election details updated successfully");
        console.log(data);
        setIsProcessing(false);
      }
    } catch (error) {
      console.log(error);
      setIsProcessing(false);
    }
  };
  console.log(state);

  return (
    <DashboardLayout>
      {isFecthElection ? (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      ) : (
        <div>
          <div className="text-2xl font-semibold pb-5">Election Details</div>
          <div className="mt-[30px]">
            <form
              className="font-semibold"
              encType="multipart/form-data"
              onSubmit={handleEditElection}
            >
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
              {votarPlan === "Free Votar" && (
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

              {votarPlan === "Votar Pro" && (
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
                          {primaryColors.map((color) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#ccc]"
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
                          {secondaryColors.map((color) => (
                            <div
                              className="p-3 cursor-pointer hover:bg-[#ccc]"
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
                  <div
                    className={`w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer ${
                      election?.max_number_candidate == 0
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-1 cursor-pointer"
                    }`}
                    onClick={decreaseCanditateNo}
                  >
                    <AiOutlineMinus />
                  </div>
                  <input
                    type="text"
                    value={election?.max_number_candidate}
                    className="w-10 outline-none text-center"
                    onChange={handleChange}
                  />
                  <div
                    className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                    onClick={handleCandidateNo}
                  >
                    <AiOutlinePlus />
                  </div>
                </div>
              </div>
              <div className="mt-5">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ElectionDetail;
