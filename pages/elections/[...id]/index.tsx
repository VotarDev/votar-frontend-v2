import DashboardLayout from "@/src/components/DashboardLayout";
import React, { useState, useEffect, useReducer } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import DetailsPage from "@/src/components/ElectionsPage/DetailsPage";
import BallotsPage from "@/src/components/ElectionsPage/BallotsPage";
import VotersPage from "@/src/components/CreateElection/Steps/VotersPage";
import Pay from "@/src/components/CreateElection/Steps/Pay";
import MonitorElection from "@/src/components/CreateElection/Steps/MonitorElection";
import StepHeader from "@/src/components/CreateElection/StepHeader";
import PageHeader from "@/src/components/shared/PageHeader";
import ActionBar from "@/src/components/shared/ActionBar";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getStatusForElection } from "@/utils/electionStatus";
import { scrollToTop } from "@/utils/scrollToTop";
import { DetailFormAction, DetailFormState } from "@/utils/types";
import { formatDate, formatDateToISO, formatTimeToHHMM } from "@/utils/util";
import setAuthToken from "@/utils/setAuthToken";
import { updateElection, updateCandidate, getElectionById } from "@/utils/api";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";

let steps = [
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
  price_per_vote: 0,
  free_votes: 0,
};

const ElectionDetail = () => {
  const router = useRouter();
  const users = useCurrentUser();
  const user = useUser();
  const [electionID, setElectionID] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [election, setElection] = useState<any>(null);
  // 0-based. Remembered per election (it used to be one shared value, so
  // opening another election landed on the step last used anywhere).
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [position, setPosition] = useState<any>([]);
  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  const [state, dispatch] = useReducer(reducer, initState);
  const cookies = new Cookies();


  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[idType.length - 1]);
    }
  }, [id, electionID]);

  const stepStorageKey = electionID ? `electionManageStep:${electionID}` : null;

  useEffect(() => {
    if (!stepStorageKey) return;
    const saved = Number(localStorage.getItem(stepStorageKey));
    setCurrentStep(Number.isFinite(saved) && saved > 0 ? saved : 0);
  }, [stepStorageKey]);

  useEffect(() => {
    if (stepStorageKey) {
      localStorage.setItem(stepStorageKey, String(currentStep));
    }
    scrollToTop();
  }, [currentStep]);

  useEffect(() => {
    const getElection = async () => {
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }
      // if (users?.data) {
      //   setAuthToken(users.data.data.cookie);
      // } else {
      //   if (typeof window !== "undefined") {
      //     const tokenLocal = localStorage.getItem("token");
      //     setAuthToken(tokenLocal);
      //   }
      // }
      setIsFetchElection(true);
      try {
        if (electionID) {
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData);

          if (data) {
            setElection(data.data);

            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
        setIsFetchElection(false);
        console.log(e);
      }
    };
    getElection();
  }, [electionID]);

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const getSteps = (plan: string) => {
    return election?.type === "Free Votar"
      ? ["Details", "Ballot", "Pay", "Monitor Election"]
      : ["Details", "Ballot", "Voters Page", "Pay", "Monitor Election"];
  };

  const steps = getSteps(votarPlan);
  const activeIndex = Math.min(currentStep, steps.length - 1);

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
          price_per_vote: action.value.price_per_vote,
          free_votes: action.value.free_votes,
        };
      case "INCREMENT_PRICE_PER_VOTE":
        return {
          ...state,
          price_per_vote: state.price_per_vote + action.value,
        };
      case "DECREMENT_PRICE_PER_VOTE":
        return {
          ...state,
          price_per_vote: state.price_per_vote - action.value,
        };
      case "INCREMENT_FREE_VOTE":
        return {
          ...state,
          free_votes: state.free_votes + action.value,
        };
      case "DECREMENT_FREE_VOTE":
        return {
          ...state,
          free_votes: state.free_votes - action.value,
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
    const token = cookies.get("user-token");

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
    formData.append("price_per_vote", String(state.price_per_vote));
    formData.append("free_votes", String(state.free_votes));
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
          if (token) {
            setAuthToken(token);
          }
          const { data } = await updateElection(formData, USER_ID);

          if (data) {
            toast.success("Election details updated successfully");
            console.log(data);
            setIsProcessing(false);
          }
          break;
        case 1:
          if (token) {
            setAuthToken(token);
          }
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

  const stepName = steps[activeIndex];
  const isLastStep = activeIndex === steps.length - 1;
  const savesStep = stepName === "Details" || stepName === "Ballot";

  return (
    <DashboardLayout>
      <ProtectedRoutes>
        <div className="relative mx-auto w-full max-w-6xl pt-2">
          <Link
            href="/elections"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All elections
          </Link>

          {isFetchElection || !election ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <>
              <PageHeader
                title={election.name_of_election || "Election"}
                description="Update this election's details, ballot and voters."
                actions={
                  <div className="flex flex-wrap items-center gap-2">
                    <ElectionStatusBadge status={getStatusForElection(election)} />
                    {election.type && (
                      <Badge variant="secondary">{election.type}</Badge>
                    )}
                  </div>
                }
              />

              <div className="mt-6 rounded-lg border border-border bg-surface p-4 shadow-sm lg:px-6">
                {/* Every step can be opened directly, as before. */}
                <StepHeader
                  steps={steps}
                  currentStep={activeIndex + 1}
                  furthestStep={steps.length}
                  onStepChange={(step) => goToStep(step - 1)}
                />
              </div>

              <div className="mt-6">
                {stepName === "Details" && (
                  <DetailsPage
                    electionId={electionID}
                    userId={USER_ID}
                    state={state}
                    dispatch={dispatch}
                  />
                )}
                {stepName === "Ballot" && (
                  <BallotsPage position={position} setPosition={setPosition} />
                )}
                {/* Same Voters step as the create flow. */}
                {stepName === "Voters Page" && (
                  <VotersPage electionId={electionID} />
                )}
                {/* Same Pay and Monitor steps as the create flow. */}
                {stepName === "Pay" && <Pay />}
                {stepName === "Monitor Election" && (
                  <MonitorElection electionId={electionID} />
                )}
              </div>

              <ActionBar>
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={activeIndex === 0}
                    className="h-11"
                  >
                    <ArrowLeft /> Back
                  </Button>
                  <span className="hidden text-sm text-muted-foreground smm:block">
                    Step {activeIndex + 1} of {steps.length}
                  </span>
                  {isLastStep ? (
                    // Same last-step button as the create flow.
                    <Button asChild className="h-11 min-w-[150px]">
                      <Link href="/elections">Finish</Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={isProcessing}
                      className="h-11 min-w-[150px]"
                    >
                      {isProcessing && <Loader2 className="animate-spin" />}
                      {savesStep ? "Save and continue" : "Continue"}
                      {!isProcessing && <ArrowRight />}
                    </Button>
                  )}
                </div>
              </ActionBar>
            </>
          )}
        </div>
      </ProtectedRoutes>
    </DashboardLayout>
  );
};

export default ElectionDetail;
