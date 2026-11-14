import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import PlanSelector from "../PlanSelector";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
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
import type { DetailsErrors } from "../validation";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Unchanged from before: the organiser's WAT input converted to UTC, in the
// format the API expects ("November 5, 2026 07:30").
const formatDateTimeToUTC = (date: string, time: string): string => {
  if (!date || !time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const dateTime = new Date(date);
  dateTime.setHours(hours, minutes, 0, 0);

  const utcDateTime = new Date(dateTime.getTime() - 1 * 60 * 60 * 1000);

  const month = MONTHS[utcDateTime.getMonth()];
  const day = utcDateTime.getDate();
  const year = utcDateTime.getFullYear();
  const utcHours = utcDateTime.getHours().toString().padStart(2, "0");
  const utcMinutes = utcDateTime.getMinutes().toString().padStart(2, "0");

  return `${month} ${day}, ${year} ${utcHours}:${utcMinutes}`;
};

/**
 * The reverse of formatDateTimeToUTC: the "HH:mm" the organiser picked, so the
 * time still shows after moving to another step and back.
 */
const clockFromFormatted = (formatted?: string): string => {
  const match = /^([A-Za-z]+) (\d{1,2}), (\d{4}) (\d{2}):(\d{2})$/.exec(
    formatted || "",
  );
  if (!match) return "";
  const month = MONTHS.indexOf(match[1]);
  if (month === -1) return "";
  const local = new Date(
    Number(match[3]),
    month,
    Number(match[2]),
    Number(match[4]),
    Number(match[5]),
  );
  const picked = new Date(local.getTime() + 1 * 60 * 60 * 1000);
  return `${String(picked.getHours()).padStart(2, "0")}:${String(
    picked.getMinutes(),
  ).padStart(2, "0")}`;
};

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

const Details = ({
  setElection,
  election,
  setImage,
  imageFile,
  backgroundImage,
  setBackground,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  startDate,
  setDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  candidateNo,
  setCandidateNo,
  description,
  setDescription,
  setLogo,
  pricePerVote,
  setPricePerVote,
  setBackgroundImageFile,
  numberofFreeVote,
  setNumberofFreeVote,
  // Held by the create page, which validates the price when this is on.
  monetizeElection,
  setMonetizeElection,
  errors = {},
}: any) => {
  const fieldErrors: DetailsErrors = errors;

  // The times as picked ("HH:mm"); the API value is recomputed from these
  // whenever the date or the time changes.
  const [startClock, setStartClock] = useState(() =>
    clockFromFormatted(startTime),
  );
  const [endClock, setEndClock] = useState(() => clockFromFormatted(endTime));

  // The background image being cropped; the crop dialog is open while set.
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  const handleCropSave = (croppedImage: File) => {
    const blobUrl = URL.createObjectURL(croppedImage);
    setBackground(blobUrl);
    setBackgroundImageFile(croppedImage);
    setImageSrc(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > 1000) {
        toast.error("File too Large");
        return;
      }
      setLogo(file);

      const reader = new FileReader();
      reader.onload = (event: any) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setImage(null);
  };

  const handleBackgroundImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
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
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    setBackground(null);
    setBackgroundImageFile(null);
  };

  const handleStartDateChange = (newStartDate: string) => {
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      toast.error("Start date cannot be greater than end date");
      return;
    }
    setDate(newStartDate);
    if (startClock) setStartTime(formatDateTimeToUTC(newStartDate, startClock));
  };

  const handleEndDateChange = (newEndDate: string) => {
    if (startDate && new Date(newEndDate) < new Date(startDate)) {
      toast.error("End date cannot be less than start date");
      return;
    }
    setEndDate(newEndDate);
    if (endClock) setEndTime(formatDateTimeToUTC(newEndDate, endClock));
  };

  const handleStartClockChange = (time: string) => {
    setStartClock(time);
    setStartTime(formatDateTimeToUTC(startDate, time));
  };

  const handleEndClockChange = (time: string) => {
    setEndClock(time);
    setEndTime(formatDateTimeToUTC(endDate, time));
  };

  const handleCandidateNo = () => {
    setCandidateNo(candidateNo + 1);
  };
  const decreaseCanditateNo = () => {
    if (candidateNo > 0) {
      setCandidateNo(candidateNo - 1);
    }
  };

  const votingPriceIncrement = () => {
    setPricePerVote((prev: number) => (Number(prev) + 1).toString());
  };

  const votingPriceDecrement = () => {
    setPricePerVote((prev: number) => Math.max(0, Number(prev) - 1).toString());
  };

  const numberofFreeVoteIncrement = () => {
    setNumberofFreeVote(numberofFreeVote + 1);
  };

  const numberofFreeVoteDecrement = () => {
    if (numberofFreeVote > 0) {
      setNumberofFreeVote(numberofFreeVote - 1);
    }
  };

  const startDay = parseDateValue(startDate);
  const endDay = parseDateValue(endDate);

  // On a same-day election, the end time has to be after the start time.
  const isSameDay = !!startDate && startDate === endDate;
  const timeOrderError =
    isSameDay && startClock && endClock && endClock <= startClock
      ? "Voting must close after it opens."
      : undefined;
  const endTimeError = fieldErrors.endTime || timeOrderError;

  return (
    <div className="space-y-6">
      <form
        className="space-y-6"
        encType="multipart/form-data"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormSection
          title="Election type"
          description="Free Votar and Votar Pro offer different options below."
        >
          <PlanSelector />
        </FormSection>

        <FormSection
          title="Basic information"
          description="What voters will see at the top of the ballot."
        >
          <FormField
            label="Name of election"
            htmlFor="electionName"
            required
            error={fieldErrors.electionName}
            info="This is the official title of your election. It will be displayed prominently on the ballot page that voters see."
          >
            <Input
              id="electionName"
              name="electionName"
              placeholder="e.g. Student Union Elections 2026"
              onChange={(e) => setElection(e.target.value)}
              value={election}
              aria-invalid={!!fieldErrors.electionName || undefined}
              className="max-w-xl"
            />
          </FormField>
          <FormField
            label="Other details"
            htmlFor="otherDetails"
            info="Provide any additional context about this election — e.g. purpose, rules, or instructions for voters."
          >
            <Textarea
              id="otherDetails"
              name="otherDetails"
              placeholder="Purpose, rules or instructions for voters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              previewUrl={imageFile}
              onFileChange={handleLogoUpload}
              onRemove={removeLogo}
              requirements="PNG, SVG, JPG or JPEG · Max 1MB"
            />
          </FormField>

          {votarPlan === "Free Votar" && (
            <FormField
              label="Background image"
              htmlFor="file-input2"
              info="This image will be displayed as the background on your election page. Keep it simple so it doesn't distract from the ballot content."
            >
              <ImageUpload
                id="file-input2"
                accept=".png, .svg, .jpg, .jpeg,"
                previewUrl={backgroundImage}
                onFileChange={handleBackgroundImageUpload}
                onRemove={removeBackground}
                requirements="PNG, SVG, JPG or JPEG · Max 100KB · You'll crop it to 16:9"
                previewClassName="w-36 object-cover"
              />
            </FormField>
          )}

          {votarPlan === "Votar Pro" && (
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Primary background colour"
                info="The dominant color of your election page background."
              >
                <ColorSelect
                  value={primaryColor?.value}
                  onChange={setPrimaryColor}
                  ariaLabel="Primary background colour"
                />
              </FormField>
              <FormField
                label="Secondary background colour"
                info="An accent color that complements the primary color on your election page."
              >
                <ColorSelect
                  value={secondaryColor?.value}
                  onChange={setSecondaryColor}
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
              required
              error={fieldErrors.startDate}
              info="The date voting opens and voters can begin casting their votes."
            >
              <DatePicker
                id="startDate"
                invalid={!!fieldErrors.startDate}
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Select start date"
                disabled={endDay ? { after: endDay } : undefined}
              />
            </FormField>
            <FormField
              label="Start time"
              htmlFor="startTime"
              required
              error={fieldErrors.startTime}
              info="The exact time voting begins on the start date."
            >
              <TimePicker
                id="startTime"
                invalid={!!fieldErrors.startTime}
                before={isSameDay && endClock ? endClock : undefined}
                value={startClock}
                onChange={handleStartClockChange}
                placeholder="Select start time"
              />
            </FormField>
            <FormField
              label="End date"
              htmlFor="endDate"
              required
              error={fieldErrors.endDate}
              info="The date voting closes. No votes will be accepted after this date."
            >
              <DatePicker
                id="endDate"
                invalid={!!fieldErrors.endDate}
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="Select end date"
                disabled={startDay ? { before: startDay } : undefined}
              />
            </FormField>
            <FormField
              label="End time"
              htmlFor="endTime"
              required
              error={endTimeError}
              info="The exact time voting closes on the end date."
            >
              <TimePicker
                id="endTime"
                invalid={!!endTimeError}
                after={isSameDay && startClock ? startClock : undefined}
                value={endClock}
                onChange={handleEndClockChange}
                placeholder="Select end time"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Voting rules">
          <SettingRow
            label="Max candidates per position"
            info="How many candidates a voter is allowed to select for each position on the ballot."
          >
            <NumberStepper
              value={candidateNo}
              onIncrement={handleCandidateNo}
              onDecrement={decreaseCanditateNo}
              atMinimum={candidateNo == 0}
              label="max candidates per position"
            />
          </SettingRow>

          {votarPlan === "Free Votar" && (
            <>
              <SettingRow
                label="Number of free votes"
                info="The total number of votes available at no cost. Once this limit is reached, additional votes may require payment."
              >
                <NumberStepper
                  value={numberofFreeVote}
                  onIncrement={numberofFreeVoteIncrement}
                  onDecrement={numberofFreeVoteDecrement}
                  atMinimum={numberofFreeVote == 0}
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
                        id="pricePerVote"
                        invalid={!!fieldErrors.pricePerVote}
                        value={pricePerVote}
                        onIncrement={votingPriceIncrement}
                        onDecrement={votingPriceDecrement}
                        onChange={setPricePerVote}
                        atMinimum={pricePerVote == 0}
                        label="price per vote"
                      />
                    </SettingRow>
                    {fieldErrors.pricePerVote && (
                      <p
                        role="alert"
                        className="mt-2 text-right text-xs font-medium text-destructive"
                      >
                        {fieldErrors.pricePerVote}
                      </p>
                    )}
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

export default Details;
