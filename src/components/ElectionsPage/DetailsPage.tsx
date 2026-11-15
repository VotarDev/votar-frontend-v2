import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import VotingLockNotice from "@/src/components/shared/VotingLockNotice";
import { getElectionById } from "@/utils/api";
import { useCurrentUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { DetailFormState, ElectionDetails } from "@/utils/types";
import { parseElectionDate } from "@/utils/electionTime";
import { withCacheBust } from "@/utils/electionMedia";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Skeleton } from "@/src/components/ui/skeleton";
import FormSection from "@/src/components/shared/form/FormSection";
import FormField from "@/src/components/shared/form/FormField";
import InfoTip from "@/src/components/shared/form/InfoTip";
import ImageUpload from "@/src/components/shared/form/ImageUpload";
import NumberStepper from "@/src/components/shared/form/NumberStepper";
import DatePicker, {
  parseDateValue,
} from "@/src/components/shared/form/DatePicker";
import TimePicker from "@/src/components/shared/form/TimePicker";
import ColorSelect from "@/src/components/shared/form/ColorSelect";
import ImageCropDialog from "@/src/components/shared/form/ImageCropDialog";

const IMAGE_LIMIT_BYTES = 100 * 1024; // 100KB, as before
const IMAGE_LIMIT_MESSAGE =
  "File size exceeds 100kb. Please select a smaller image.";

/** A label + "i" tooltip on the left and a control on the right (stacked on phones). */
const SettingRow = ({
  label,
  info,
  children,
}: {
  label: string;
  info: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 smm:flex-row smm:items-center smm:justify-between">
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <InfoTip label={`About ${label}`}>{info}</InfoTip>
    </div>
    {children}
  </div>
);

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
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [monetizeElection, setMonetizeElection] = useState(false);
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  // The background image being cropped; the crop dialog is open while set.
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const getElection = async () => {
      // Email sign-in keeps the token on the user; everyone else (e.g. Google
      // sign-in) has it in the cookie. Never clear the shared header here.
      const token =
        users?.data?.data?.cookie || new Cookies().get("user-token");
      if (token) setAuthToken(token);
      setIsFetchElection(true);
      try {
        if (electionId) {
          const { data } = await getElectionById({ election_id: electionId });
          if (data) {
            const electionData = data.data;
            setElection(electionData);
            dispatch({ type: "SET_ELECTION", value: electionData });

            // Voting start, for locking fields that can't change once it begins.
            setTargetDateTime(parseElectionDate(electionData.start_date));
            // SET_ELECTION fills the dates and times in the organiser's
            // timezone (see toOrganiserDateTime).
            // Show the price when the election already charges per vote.
            setMonetizeElection(Number(electionData.price_per_vote) > 0);
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsFetchElection(false);
      }
    };
    getElection();
  }, [electionId]);

  useEffect(() => {
    if (targetDateTime) {
      const updateEditableState = () => {
        setIsEditable(new Date() < targetDateTime);
      };
      updateEditableState();
      const interval = setInterval(updateEditableState, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const setField = (field: keyof DetailFormState, value: unknown) =>
    dispatch({ type: "SET_FIELD", field, value });

  const handleStartDateChange = (value: string) => {
    if (state.end_date && new Date(value) > new Date(state.end_date)) {
      toast.error("Start date cannot be later than end date!");
      return;
    }
    setField("start_date", value);
  };

  const handleEndDateChange = (value: string) => {
    if (state.start_date && new Date(value) < new Date(state.start_date)) {
      toast.error("End date cannot be earlier than start date!");
      return;
    }
    setField("end_date", value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > IMAGE_LIMIT_BYTES) {
        toast.error(IMAGE_LIMIT_MESSAGE);
        return;
      }
      dispatch({ type: "SET_IMAGE", image: file });
    }
  };

  const handleBackgroundImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > IMAGE_LIMIT_BYTES) {
        toast.error(IMAGE_LIMIT_MESSAGE);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (croppedImage: File) => {
    dispatch({ type: "SET_BACKGROUND_IMAGE", background_image: croppedImage });
    setImageSrc(null);
  };

  // The counters can't go below 0 (they could before).
  const step = (type: string, current: number, delta: 1 | -1) => {
    if (delta < 0 && Number(current) <= 0) return;
    dispatch({ type, value: 1 });
  };

  const logoPreview =
    state.imagePreview ||
    (typeof state.image === "string" ? state.image : null) ||
    election?.association_logo ||
    null;
  const savedBackground = useMemo(
    () => withCacheBust(election?.elect_background_img),
    [election?.elect_background_img],
  );
  const backgroundPreview = state.background_image_preview || savedBackground;

  const startDay = parseDateValue(state.start_date);
  const endDay = parseDateValue(state.end_date);
  const isSameDay = !!state.start_date && state.start_date === state.end_date;
  const timeOrderError =
    isSameDay &&
    state.start_time &&
    state.end_time &&
    state.end_time <= state.start_time
      ? "Voting must close after it opens."
      : undefined;

  if (isFetchElection || !election) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        encType="multipart/form-data"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormSection
          title="Basic information"
          description="What voters will see at the top of the ballot."
        >
          <FormField
            label="Name of election"
            htmlFor="electionName"
            info="This is the official title of your election. It will be displayed prominently on the ballot page that voters see."
          >
            <Input
              id="electionName"
              name="electionName"
              value={state.electionName || ""}
              onChange={(e) => setField("electionName", e.target.value)}
              className="max-w-xl"
            />
          </FormField>
          <FormField
            label="Other details"
            htmlFor="description"
            info="Provide any additional context about this election — e.g. purpose, rules, or instructions for voters."
          >
            <Textarea
              id="description"
              name="description"
              value={state.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              className="max-w-xl"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Branding"
          description="Make the ballot page look like your organisation."
        >
          <FormField
            label="Association logo"
            htmlFor="file-input"
            info="Your association's logo will appear on the ballot page. Use a clear image with a transparent background for best results."
          >
            <ImageUpload
              id="file-input"
              accept=".png, .svg, .jpg, .jpeg,"
              previewUrl={logoPreview}
              onFileChange={handleImageUpload}
              requirements="PNG, SVG, JPG or JPEG · Max 100KB"
            />
          </FormField>

          {election.type === "Free Votar" && (
            <FormField
              label="Background image"
              htmlFor="file-input2"
              info="This image will be displayed as the background on your election page. Keep it simple so it doesn't distract from the ballot content."
            >
              <ImageUpload
                id="file-input2"
                accept=".png, .svg, .jpg, .jpeg,"
                previewUrl={backgroundPreview}
                onFileChange={handleBackgroundImageUpload}
                requirements="PNG, SVG, JPG or JPEG · Max 100KB · You'll crop it to 16:9"
                previewClassName="w-36 object-cover"
              />
            </FormField>
          )}

          {election.type === "Votar Pro" && (
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Primary background colour"
                info="The dominant color of your election page background."
              >
                <ColorSelect
                  value={state.primary_color}
                  onChange={(option) =>
                    dispatch({ type: "SET_PRIMARY_COLOR", value: option.value })
                  }
                  ariaLabel="Primary background colour"
                />
              </FormField>
              <FormField
                label="Secondary background colour"
                info="An accent color that complements the primary color on your election page."
              >
                <ColorSelect
                  value={state.secondary_color}
                  onChange={(option) =>
                    dispatch({
                      type: "SET_SECONDARY_COLOR",
                      value: option.value,
                    })
                  }
                  ariaLabel="Secondary background colour"
                />
              </FormField>
            </div>
          )}
        </FormSection>

        <FormSection
          title="Schedule"
          description="When voting opens and closes."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Start date"
              htmlFor="startDate"
              info="The date voting opens and voters can begin casting their votes."
            >
              <DatePicker
                id="startDate"
                value={state.start_date || ""}
                onChange={handleStartDateChange}
                placeholder="Select start date"
                disabled={endDay ? { after: endDay } : undefined}
              />
            </FormField>
            <FormField
              label="Start time"
              htmlFor="startTime"
              info="The exact time voting begins on the start date."
            >
              <TimePicker
                id="startTime"
                value={state.start_time || ""}
                onChange={(value) => setField("start_time", value)}
                placeholder="Select start time"
                before={
                  isSameDay && state.end_time ? state.end_time : undefined
                }
              />
            </FormField>
            <FormField
              label="End date"
              htmlFor="endDate"
              info="The date voting closes. No votes will be accepted after this date."
            >
              <DatePicker
                id="endDate"
                value={state.end_date || ""}
                onChange={handleEndDateChange}
                placeholder="Select end date"
                disabled={startDay ? { before: startDay } : undefined}
              />
            </FormField>
            <FormField
              label="End time"
              htmlFor="endTime"
              info="The exact time voting closes on the end date."
              error={timeOrderError}
            >
              <TimePicker
                id="endTime"
                value={state.end_time || ""}
                onChange={(value) => setField("end_time", value)}
                placeholder="Select end time"
                invalid={!!timeOrderError}
                after={
                  isSameDay && state.start_time ? state.start_time : undefined
                }
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Voting rules">
          {!isEditable && (
            <VotingLockNotice
              endDate={election?.end_date}
              subject="the number of candidates per position"
              className="p-3"
            />
          )}
          <SettingRow
            label="Max candidates per position"
            info="How many candidates a voter is allowed to select for each position on the ballot."
          >
            <NumberStepper
              value={state.max_number_candidate ?? 0}
              onIncrement={() =>
                isEditable &&
                step("INCREMENT_CANDIDATE_NO", state.max_number_candidate, 1)
              }
              onDecrement={() =>
                isEditable &&
                step("DECREMENT_CANDIDATE_NO", state.max_number_candidate, -1)
              }
              atMinimum={!isEditable || Number(state.max_number_candidate) <= 0}
              label="max candidates per position"
            />
          </SettingRow>

          {election.type === "Free Votar" && (
            <>
              <SettingRow
                label="Number of free votes"
                info="The total number of votes available at no cost. Once this limit is reached, additional votes may require payment."
              >
                <NumberStepper
                  value={state.free_votes ?? 0}
                  onIncrement={() =>
                    step("INCREMENT_FREE_VOTE", state.free_votes, 1)
                  }
                  onDecrement={() =>
                    step("DECREMENT_FREE_VOTE", state.free_votes, -1)
                  }
                  atMinimum={Number(state.free_votes) <= 0}
                  label="number of free votes"
                />
              </SettingRow>

              <div className="rounded-lg border border-border p-4">
                <SettingRow
                  label="Monetize election"
                  info="Enable this to charge voters a fee per vote. You can set the price below once enabled."
                >
                  <Switch
                    checked={monetizeElection}
                    onCheckedChange={setMonetizeElection}
                    aria-label="Monetize election"
                  />
                </SettingRow>
                {monetizeElection && (
                  <div className="mt-4 border-t border-border pt-4">
                    <SettingRow
                      label="Price per vote"
                      info="The amount (in your local currency) charged to a voter for each vote they cast."
                    >
                      <NumberStepper
                        value={state.price_per_vote ?? 0}
                        onIncrement={() =>
                          step(
                            "INCREMENT_PRICE_PER_VOTE",
                            state.price_per_vote,
                            1,
                          )
                        }
                        onDecrement={() =>
                          step(
                            "DECREMENT_PRICE_PER_VOTE",
                            state.price_per_vote,
                            -1,
                          )
                        }
                        atMinimum={Number(state.price_per_vote) <= 0}
                        label="price per vote"
                      />
                    </SettingRow>
                  </div>
                )}
              </div>
            </>
          )}
        </FormSection>
      </form>

      <ImageCropDialog
        imageSrc={imageSrc}
        onCancel={() => setImageSrc(null)}
        onSave={handleCropSave}
      />
    </div>
  );
};

export default DetailsPage;
