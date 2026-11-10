import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import Details from "@/src/components/CreateElection/Steps/Details";
import Ballot from "@/src/components/CreateElection/Steps/Ballot";
import VotersPage from "@/src/components/CreateElection/Steps/VotersPage";

import Pay from "@/src/components/CreateElection/Steps/Pay";
import MonitorElection from "@/src/components/CreateElection/Steps/MonitorElection";
import { useRouter } from "next/router";
import StepHeader from "@/src/components/CreateElection/StepHeader";
import { getElectionSteps } from "@/src/components/CreateElection/steps";
import PageHeader from "@/src/components/shared/PageHeader";
import ActionBar from "@/src/components/shared/ActionBar";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ELECTION_DRAFT_KEYS, getElectionDraft } from "@/utils/electionDraft";
import {
  DETAILS_FIELD_ORDER,
  type DetailsErrors,
  validateBallot,
  validateDetails,
} from "@/src/components/CreateElection/validation";
import {
  createFreeElection,
  createElection,
  createCandidate,
} from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { toast } from "react-hot-toast";
import { OptionTypes, Position } from "@/utils/types";
import { formatDate } from "@/utils/util";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Create = () => {
  let step = 1;
  let furthest = 1;
  let election_id;
  if (typeof window !== "undefined") {
    const draft = getElectionDraft();
    step = draft.step;
    furthest = draft.furthestStep;
  }

  const cookies = new Cookies();
  const [currentStep, setCurrentStep] = useState(step);
  // The furthest step reached, so users can move back and forward between
  // steps they've already been through without going past unsaved ones.
  const [furthestStep, setFurthestStep] = useState(furthest);
  // Set when the user changes anything on the current step; cleared after a save.
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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
  const [monetizeElection, setMonetizeElection] = useState(false);
  // Required-field errors on the Details step, shown after a save attempt.
  const [detailsErrors, setDetailsErrors] = useState<DetailsErrors>({});
  const [isBallotEditable, setIsBallotEditable] = useState(true);
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

  const steps = getElectionSteps(votarPlan);

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
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTIme}
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
            monetizeElection={monetizeElection}
            setMonetizeElection={setMonetizeElection}
            errors={detailsErrors}
            setBackgroundImageFile={setBackgroundImageFile}
          />
        );
      case "Ballot":
        return (
          <Ballot
            setPositions={setPositions}
            positions={positions}
            onEditableChange={setIsBallotEditable}
          />
        );
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

  const detailsValues = {
    electionName,
    startDate,
    endDate,
    startTime,
    endTime: endTIme,
    monetizeElection,
    pricePerVote,
  };

  // Checks the current step's required fields. Returns false (and shows what's
  // missing) when the step can't be saved yet.
  const canSaveStep = () => {
    const stepName = steps[currentStep - 1];

    if (stepName === "Details") {
      const errors = validateDetails(detailsValues);
      setDetailsErrors(errors);
      const firstInvalid = DETAILS_FIELD_ORDER.find((field) => errors[field]);
      if (firstInvalid) {
        toast.error("Please fill in the required fields.");
        const el = document.getElementById(firstInvalid);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
        return false;
      }
    }

    if (stepName === "Ballot" && isBallotEditable) {
      const problem = validateBallot(positions);
      if (problem) {
        toast.error(problem);
        return false;
      }
    }

    return true;
  };

  // After a failed attempt, update the errors as the user fixes each field.
  useEffect(() => {
    if (Object.keys(detailsErrors).length === 0) return;
    setDetailsErrors(validateDetails(detailsValues));
  }, [
    electionName,
    startDate,
    endDate,
    startTime,
    endTIme,
    monetizeElection,
    pricePerVote,
  ]);

  const handleClick = async (direction: string) => {
    if (!canSaveStep()) return;

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
            // Saved: coming back to Ballot later starts a fresh ballot rather
            // than re-sending these candidates.
            setPositions([]);
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

    if (newStep > currentStep) setHasUnsavedChanges(false);
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  const handleBackButton = () => {
    let newStep = currentStep;
    newStep--;
    // On the first step, leave the page. (Storing step 0 here used to leave a
    // blank page on the next visit.)
    if (newStep <= 0) {
      router.back();
      return;
    }

    currentStep > 0 && currentStep <= steps.length && setCurrentStep(newStep);
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= furthestStep)
      setCurrentStep(stepNumber);
  };

  // A saved step from another plan can be past the end of this plan's steps.
  useEffect(() => {
    if (currentStep > steps.length) setCurrentStep(steps.length);
  }, [currentStep, steps.length]);

  useEffect(() => {
    localStorage.setItem("electionSteps", JSON.stringify(currentStep));
    setFurthestStep((prev) => Math.max(prev, currentStep));
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(
      ELECTION_DRAFT_KEYS.furthestStep,
      JSON.stringify(furthestStep),
    );
  }, [furthestStep]);

  // Ballot changes (adding positions or candidates) aren't always typed input.
  const positionsLoaded = useRef(false);
  useEffect(() => {
    if (!positionsLoaded.current) {
      positionsLoaded.current = positions.length > 0;
      return;
    }
    // Cleared after a save: nothing left to lose.
    if (positions.length === 0) return;
    setHasUnsavedChanges(true);
  }, [positions]);

  const activeStep = Math.min(currentStep, steps.length);
  const isLastStep = activeStep === steps.length;
  // Details and Ballot keep their input in memory until "Save and continue";
  // the other steps save through their own buttons.
  const holdsUnsavedInput = ["Details", "Ballot"].includes(
    steps[activeStep - 1],
  );

  // Warn before a refresh or closing the tab would discard unsaved input.
  useEffect(() => {
    if (!hasUnsavedChanges || !holdsUnsavedInput) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsavedChanges, holdsUnsavedInput]);

  return (
    <ProtectedRoutes>
      <DashboardLayout>
        {/* `relative` keeps the form's visually hidden inputs (file uploads,
            the switch) inside the scrolling area; without it they stretch the
            outer layout column and add a second, empty scroll. */}
        <div className="relative mx-auto w-full max-w-6xl pt-2">
          <PageHeader
            title="Create an election"
            description="Set up your election step by step. Each step is saved when you continue."
            actions={
              votarPlan ? <Badge variant="secondary">{votarPlan}</Badge> : null
            }
          />
          <div className="mt-6 rounded-lg border border-border bg-surface p-4 shadow-sm lg:px-6">
            <StepHeader
              steps={steps}
              currentStep={activeStep}
              furthestStep={furthestStep}
              onStepChange={goToStep}
            />
          </div>
          <div
            onInputCapture={() => setHasUnsavedChanges(true)}
            onChangeCapture={() => setHasUnsavedChanges(true)}
          >
            {displaySteps(activeStep)}
          </div>
          <ActionBar>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleBackButton}
                className="h-11"
              >
                <ArrowLeft /> Back
              </Button>
              <span className="hidden text-sm text-muted-foreground smm:block">
                Step {activeStep} of {steps.length}
              </span>
              <Button
                onClick={() => handleClick("next")}
                disabled={isLoading}
                className="h-11 min-w-[150px]"
              >
                {isLoading && <Loader2 className="animate-spin" />}
                {isLastStep ? "Save" : "Save and continue"}
                {!isLoading && !isLastStep && <ArrowRight />}
              </Button>
            </div>
          </ActionBar>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Create;
