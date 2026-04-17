import React, { useState, useEffect } from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import Details from "@/src/components/CreateElection/Steps/Details";
import Ballot from "@/src/components/CreateElection/Steps/Ballot";
import VotersPage from "@/src/components/CreateElection/Steps/VotersPage";

import Pay from "@/src/components/CreateElection/Steps/Pay";
import MonitorElection from "@/src/components/CreateElection/Steps/MonitorElection";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/router";
import StepHeader from "@/src/components/CreateElection/StepHeader";
import {
  createFreeElection,
  createElection,
  createCandidate,
} from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";
import { OptionTypes, Position } from "@/utils/types";
import { formatDate } from "@/utils/util";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Create = () => {
  let step = 1;
  let election_id;
  if (typeof window !== "undefined") {
    const electionStep = localStorage.getItem("electionSteps");

    if (electionStep !== null) {
      step = parseInt(electionStep, 10);
    } else {
      step = 1;
    }
  }

  const cookies = new Cookies();
  const [currentStep, setCurrentStep] = useState(step);
  const [electionName, setElectionName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const [primaryColor, setPrimaryColor] = useState<OptionTypes | null>(null);
  const [electionID, setElectionID] = useState<string | null>("");
  const [secondaryColor, setSecondaryColor] = useState<OptionTypes | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [endTIme, setEndTime] = useState("");
  const [logo, setLogo] = useState(null);
  const [numberofCandidate, setNumberofCandidate] = useState(0);
  const [numberofFreeVote, setNumberofFreeVote] = useState(1);
  const [pricePerVote, setPricePerVote] = useState(0);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { votarPlan } = useSelector((state: any) => state.votarPlan);
  const users = useCurrentUser();
  const user = useUser();
  const router = useRouter();

  //ballot
  const [positions, setPositions] = useState<Position[]>([]);

  if (typeof window !== "undefined") {
    localStorage.setItem("positions", JSON.stringify(positions));
  }

  //ballot
  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const getSteps = (plan: string) => {
    if (plan === "Free Votar") {
      return ["Details", "Ballot", "Pay", "Monitor Election"];
    }
    return ["Details", "Ballot", "Voters Page", "Pay", "Monitor Election"];
  };

  const steps = getSteps(votarPlan);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const electionId = localStorage.getItem("ElectionId");
      console.log(electionId);

      setElectionID(electionId);
    }
  }, []);

  const displaySteps = (stepIndex: number) => {
    const currentStep = steps[stepIndex - 1];

    switch (currentStep) {
      case "Details":
        return (
          <Details
            setElection={setElectionName}
            election={electionName}
            setImage={setSelectedImage}
            imageFile={selectedImage}
            backgroundImage={backgroundImage}
            setBackground={setBackgroundImage}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            startDate={startDate}
            setDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            candidateNo={numberofCandidate}
            setCandidateNo={setNumberofCandidate}
            description={description}
            setDescription={setDescription}
            setLogo={setLogo}
            pricePerVote={pricePerVote}
            setPricePerVote={setPricePerVote}
            numberofFreeVote={numberofFreeVote}
            setNumberofFreeVote={setNumberofFreeVote}
            setBackgroundImageFile={setBackgroundImageFile}
          />
        );
      case "Ballot":
        return <Ballot setPositions={setPositions} positions={positions} />;
      case "Voters Page":
        return <VotersPage />;
      case "Pay":
        return <Pay />;
      case "Monitor Election":
        return <MonitorElection />;
      default:
        return null;
    }
  };

  const handleClick = async (direction: string) => {
    const token = cookies.get("user-token");

    let newStep = currentStep;
    setIsLoading(true);
    const [startDateString] = startDate.split(" ");
    const [endDateString] = endDate.split(" ");
    const [startYear, startMonth, startDay] = startDateString.split("-");
    const [endYear, endMonth, endDay] = endDateString.split("-");
    const formattedStartDate = formatDate(startYear, startMonth, startDay);
    const formattedEndDate = formatDate(endYear, endMonth, endDay);
    const startDateData = formattedStartDate + "," + startTime;
    const endDateData = formattedEndDate + "," + endTIme;

    const detailsFormData = new FormData();
    detailsFormData.append("name_of_election", electionName);
    detailsFormData.append("description", description);
    if (primaryColor)
      detailsFormData.append("primary_color", primaryColor?.value);
    if (secondaryColor)
      detailsFormData.append("secondary_color", secondaryColor?.value);

    detailsFormData.append("start_date", startTime);
    detailsFormData.append("end_date", endTIme);
    detailsFormData.append("type", votarPlan);
    detailsFormData.append("price_per_vote", pricePerVote.toString());
    detailsFormData.append("free_votes", numberofFreeVote.toString());

    if (logo) detailsFormData.append("election-image", logo);
    if (backgroundImageFile)
      detailsFormData.append("background-image", backgroundImageFile);
    detailsFormData.append("maxNumberCandidates", numberofCandidate.toString());

    const ballotFormData = new FormData();
    ballotFormData.append("candidates", JSON.stringify(positions));
    for (const obj of positions) {
      for (const candidate of obj.candidates) {
        if (candidate.candidate_picture) {
          ballotFormData.append("profile", candidate.candidate_picture as Blob);
        }
        if (candidate.media.docs) {
          ballotFormData.append("docs", candidate.media.docs as Blob);
        }
      }
    }

    const votersData = {};
    const reviewData = {};
    const payData = {};
    const monitorElectionData = {};

    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else {
      if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }
    }
    try {
      switch (steps[currentStep - 1]) {
        case "Details":
          if (token) {
            setAuthToken(token);
          }
          const { data } = await createElection(detailsFormData, USER_ID);
          if (data) {
            toast.success(data.status);
            localStorage.setItem("ElectionId", data.data.election_id);
          }
          newStep++;
          break;
        case "Ballot":
          if (token) {
            setAuthToken(token);
          }
          const ballotData = await createCandidate(ballotFormData, USER_ID);
          if (ballotData.data) {
            // toast.success(ballotData.data.status);
            toast.success("Candidates created successfully");
          }
          newStep++;
          break;
        case "Voters Page":
          await createFreeElection(votersData);
          newStep++;
          break;
        case "Review":
          await createFreeElection(reviewData);
          newStep++;
          break;
        case "Pay":
          await createFreeElection(payData);
          newStep++;
          break;
        case "Monitor Election":
          await createFreeElection(monitorElectionData);
          newStep++;
          break;
        default:
      }
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      setError(e.message);
      toast.error(e.message);
      console.log(e);
    }

    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  const handleBackButton = () => {
    let newStep = currentStep;
    newStep--;
    if (newStep <= 0) router.back();

    currentStep > 0 && currentStep <= steps.length && setCurrentStep(newStep);
  };

  useEffect(() => {
    localStorage.setItem("electionSteps", JSON.stringify(currentStep));
  }, [currentStep]);

  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <div className="w-full lg:px-3 px-0">
          <div>
            <StepHeader
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </div>
          <div>{displaySteps(currentStep)}</div>
          <div>
            <div className="flex gap-4 justify-end smm:flex-row flex-col">
              <div>
                <button
                  onClick={() => handleBackButton()}
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
                  onClick={() => handleClick("next")}
                  className="flex items-center gap-2 p-[10px] bg-[#015CE9] rounded-lg text-[#f3f3f3] lg:text-[18px] text-base h-[52px]"
                  disabled={isLoading}
                >
                  {isLoading && <CircularProgress color="inherit" size={20} />}
                  Save Changes to Proceed
                  <span>
                    <BsArrowRight />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Create;
