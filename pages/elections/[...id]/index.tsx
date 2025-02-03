import DashboardLayout from "@/src/components/DashboardLayout";
import React, { useState, useEffect, useReducer } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import DetailsPage from "@/src/components/ElectionsPage/DetailsPage";
import BallotsPage from "@/src/components/ElectionsPage/BallotsPage";
import VoterPage from "@/src/components/ElectionsPage/VoterPage";
import ReviewPage from "@/src/components/ElectionsPage/ReviewPage";
import PayPage from "@/src/components/ElectionsPage/PayPage";
import MonitorElectionPage from "@/src/components/ElectionsPage/MonitorElectionPage";
import { PiCaretRightBold } from "react-icons/pi";
import { DetailFormAction, DetailFormState } from "@/utils/types";
import { formatDate, formatDateToISO, formatTimeToHHMM } from "@/utils/util";
import setAuthToken from "@/utils/setAuthToken";
import { updateElection, updateCandidate } from "@/utils/api";
import { BsArrowLeft } from "react-icons/bs";

const steps = [
  "Details",
  "Ballot",
  "Voters Page",
  // "Review",
  "Pay",
  "Monitor Election",
];

const initState: DetailFormState = {
  electionName: "",
  description: "",
  primary_color: "",
  secondary_color: "",
  image: null,
  imagePreview: null,
  background_image: null,
  background_image_preview: null,
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  max_number_candidate: 0,
};

const ElectionDetail = () => {
  const router = useRouter();
  const users = useCurrentUser();
  const user = useUser();
  const [electionID, setElectionID] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(() => {
    let savedStep;
    if (typeof window !== "undefined") {
      savedStep = localStorage.getItem("currentStep");
    }
    return savedStep ? Number(savedStep) : 0;
  });
  const [position, setPosition] = useState<any>([]);

  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    localStorage.setItem("currentStep", String(currentStep));
  }, [currentStep]);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  function reducer(
    state: DetailFormState,
    action: DetailFormAction
  ): DetailFormState {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value };
      case "SET_IMAGE":
        return {
          ...state,
          image: action.image,
          imagePreview: URL.createObjectURL(action.image),
        };
      case "SET_BACKGROUND_IMAGE":
        return {
          ...state,
          background_image: action.background_image,
          background_image_preview: URL.createObjectURL(
            action.background_image
          ),
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
          image: action.value.association_logo,
          start_date: formatDateToISO(action.value.start_date),
          end_date: formatDateToISO(action.value.end_date),
          start_time: formatTimeToHHMM(Number(action.value.start_time || "")),
          end_time: formatTimeToHHMM(Number(action.value.end_time || "")),
          max_number_candidate: action.value.max_number_candidate,
        };
      case "INCREMENT_CANDIDATE_NO":
        return {
          ...state,
          max_number_candidate: state.max_number_candidate + action.value,
        };
      case "DECREMENT_CANDIDATE_NO":
        return {
          ...state,
          max_number_candidate: state.max_number_candidate - action.value,
        };
      default:
        return state;
    }
  }

  const handleStepApiCall = async (step: number) => {
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
    const startDateData = formattedStartDate + " " + state.start_time;
    const endDateData = formattedEndDate + " " + state.end_time;
    formData.append("name_of_election", state.electionName);
    formData.append("description", state.description);
    formData.append("primary_color", state.primary_color);
    formData.append("secondary_color", state.secondary_color);
    formData.append("start_date", startDateData);
    formData.append("end_date", endDateData);

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
    if (state.background_image) {
      formData.append("background-image", state.background_image);
    }

    console.log(startDateData, endDateData);

    const ballotFormData = new FormData();
    // const filterPosition = position.filter((pos: any) => !pos._id);
    // console.log(filterPosition);
    ballotFormData.append("candidates", JSON.stringify(position));
    for (const obj of position) {
      for (const candidate of obj.candidates) {
        if (candidate.candidate_picture) {
          ballotFormData.append("profile", candidate.candidate_picture as Blob);
        }
        if (candidate.media.docs) {
          ballotFormData.append("docs", candidate.media.docs as Blob);
        }
      }
    }
    try {
      switch (step) {
        case 0:
          const { data } = await updateElection(formData, USER_ID);

          if (data) {
            toast.success("Election details updated successfully");
            console.log(data);
            setIsProcessing(false);
          }
          break;
        case 1:
          const candidateRes = await updateCandidate(USER_ID, ballotFormData);

          if (candidateRes) toast.success("Successfully Updated");
          setIsProcessing(false);
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        default:
          break;
      }
      return true;
    } catch (error: any) {
      console.error("API call failed:", error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(message);
      return false;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setIsProcessing(true);
      const success = await handleStepApiCall(currentStep);
      setIsProcessing(false);
      if (success) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <DashboardLayout>
      <ProtectedRoutes>
        <div className="flex items-center lg:gap-5 gap-2 font-semibold lg:text-xl flex-wrap text-base">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-2 font-semibold lg:text-xl flex-wrap text-base"
            >
              <span
                onClick={() => goToStep(index)}
                className={`cursor-pointer ${
                  currentStep === index ? "text-blue-600" : "text-[#1e1e1e]"
                }`}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <span className="mx-1">
                  <PiCaretRightBold />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          {currentStep === 0 && (
            <DetailsPage
              electionId={electionID}
              userId={USER_ID}
              state={state}
              dispatch={dispatch}
            />
          )}
          {currentStep === 1 && (
            <BallotsPage position={position} setPosition={setPosition} />
          )}
          {currentStep === 2 && <VoterPage />}
          {/* {currentStep === 3 && <ReviewPage />} */}
          {currentStep === 3 && <PayPage />}
          {currentStep === 4 && <MonitorElectionPage electionId={electionID} />}
        </div>

        <div className="mt-5 flex gap-4 justify-end smm:flex-row flex-col">
          <div>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 p-[10px] border border-[#015CE9] rounded-lg text-[#015CE9] lg:text-[18px] text-base h-[52px]"
            >
              {" "}
              <span>
                <BsArrowLeft />
              </span>
              Go back
            </button>
          </div>
          <div>
            <button
              onClick={nextStep}
              disabled={isProcessing || currentStep === steps.length - 1}
              className="flex items-center gap-2 p-[10px] bg-[#015CE9] rounded-lg text-[#f3f3f3] lg:text-[18px] text-base h-[52px]"
            >
              {isProcessing && (
                <CircularProgress
                  color="inherit"
                  size={20}
                  className="text-white mr-2 "
                />
              )}
              Save Changes to Proceed
            </button>
          </div>
        </div>
      </ProtectedRoutes>
    </DashboardLayout>
  );
};

export default ElectionDetail;
