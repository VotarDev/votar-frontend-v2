import React, { useState, useEffect, useCallback } from "react";
import PlanChoice from "../VotarPlanChoice/PlanChoice";
import { toast } from "react-hot-toast";
import Select, {
  type DropdownIndicatorProps,
  components,
  IndicatorSeparatorProps,
  StylesConfig,
} from "react-select";
import { FaCaretDown } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import calendar from "../../../../public/assets/icons/calendar-2.svg";
import moment from "moment";
import { useSelector } from "react-redux";
import { OptionTypes } from "@/utils/types";
import { set } from "lodash";
import getCroppedImg from "@/utils/cropImage";
import { AnimatePresence } from "framer-motion";
import Modal from "../../Modal";
import Cropper from "react-easy-crop";

const Details = ({
  setElection,
  election,
  setImage,
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
  setStartTime,
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
}: any) => {
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);
  const [backgroundUrl, setbackgroundUrl] = useState<string | null>(null);
  const [monetizeElection, setMonetizeElection] = useState(false);

  //crop

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

      console.log(croppedImage);
      const blobUrl = URL.createObjectURL(croppedImage);
      setbackgroundUrl(blobUrl);

      console.log("Cropped image:", blobUrl);

      setShowCropModal(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const handleImageUpload = (e: any, image: any, url: any, fileFormat: any) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > 1000) {
        toast.error("File too Large");
        return;
      }
      fileFormat(file);

      // image(file);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const imageUrl = event.target.result;
        url(imageUrl);
        image(imageUrl);
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

  const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaCaretDown className="text-2xl text-[#1e1e1e]" />
      </components.DropdownIndicator>
    );
  };

  const IndicatorSeparator = ({ innerProps }: IndicatorSeparatorProps) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
  };

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

  const indicatorSeparatorStyle = {
    display: "none",
  };

  const customStyles: StylesConfig = {
    control: (provided: Record<string, unknown>, state: any) => ({
      ...provided,
      border: state.isFocused ? "1px solid #1e1e1e" : "1px solid #1e1e1e",
      padding: 4,
      "&:hover": {
        border: "1px solid #1e1e1e",
      },
    }),
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
    setPricePerVote(pricePerVote + 1);
  };
  const votingPriceDecrement = () => {
    if (pricePerVote > 0) {
      setPricePerVote(pricePerVote - 1);
    }
  };

  const numberofFreeVoteIncrement = () => {
    setNumberofFreeVote(numberofFreeVote + 1);
  };

  const numberofFreeVoteDecrement = () => {
    if (numberofFreeVote > 0) {
      setNumberofFreeVote(numberofFreeVote - 1);
    }
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const { votarPlan } = useSelector((state: any) => state.votarPlan);

  return (
    <div className="lg:my-[60px] my-10 ">
      <div className="lg:text-xl font-bold text-base">
        Election Details Panel For Election Organizer
        <PlanChoice />
      </div>
      <div className="mt-[30px]">
        <form className="font-semibold" encType="multipart/form-data">
          <div className="flex flex-col gap-1">
            <label htmlFor="electionName">Name of Election</label>
            <input
              type="text"
              name="electionName"
              className="lg:w-[498px] h-[48px] p-4 rounded border border-[#1E1E1E] outline-none w-full"
              onChange={(e) => setElection(e.target.value)}
              value={election}
            />
          </div>
          <div className="flex flex-col gap-1 mt-[40px]">
            <label htmlFor="otherDetails">Other Details For Election</label>
            <textarea
              className="lg:w-[498px] w-full border border-[#1E1E1E] rounded outline-none p-3 h-[150px]"
              name="otherDetails"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) =>
                  handleImageUpload(e, setImage, setSelectedImgUrl, setLogo)
                }
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
              {selectedImgUrl && (
                <div className="">
                  <img
                    src={selectedImgUrl}
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
                backgroundImage ? "lg:mt-0 mt-3" : "mt-[40px]"
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
                {backgroundUrl && (
                  <div>
                    <img
                      src={backgroundUrl}
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
                <Select
                  defaultValue={primaryColor}
                  onChange={setPrimaryColor}
                  options={primaryColors}
                  placeholder=""
                  components={{ DropdownIndicator, IndicatorSeparator }}
                  className="lg:w-[348px] h-[48px] w-full"
                  styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary25: "#ccc",
                      primary: "#1e1e1e",
                    },
                  })}
                />
              </div>
              <div className="flex flex-col gap-1 w-full lg:w-auto">
                <div>Choose Secondary Background Color</div>
                <Select
                  defaultValue={secondaryColor}
                  onChange={setSecondaryColor}
                  options={secondaryColors}
                  placeholder=""
                  components={{ DropdownIndicator, IndicatorSeparator }}
                  className="lg:w-[348px] h-[48px] w-full"
                  styles={customStyles}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 4,
                    colors: {
                      ...theme.colors,
                      primary25: "#ccc",
                      primary: "#1e1e1e",
                    },
                  })}
                />
              </div>
            </div>
          )}

          <div className="mt-[34px] flex gap-10 lg:flex-row flex-col">
            <div className=" flex flex-col gap-1 w-full lg:w-auto">
              <label htmlFor="date">Choose start date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    if (endDate && new Date(newStartDate) > new Date(endDate)) {
                      toast.error("Start date cannot be greater than end date");
                      return;
                    }
                    setDate(newStartDate);
                  }}
                  value={startDate}
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
                  name="date"
                  className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                  onChange={(e) => {
                    const newEndDate = e.target.value;
                    if (
                      startDate &&
                      new Date(newEndDate) < new Date(startDate)
                    ) {
                      toast.error("End date cannot be less than start date");
                      return;
                    }
                    setEndDate(newEndDate);
                  }}
                  value={endDate}
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
                name="time"
                className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                id="time"
                onChange={(e) =>
                  setStartTime(
                    moment(e.target.value, "HH:mm:ss").format("HH:mm:ss")
                  )
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full lg:w-auto">
              <label htmlFor="time">Input end time</label>
              <input
                type="time"
                name="time"
                className="lg:w-[348px] h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                id="time"
                onChange={(e) =>
                  setEndTime(
                    moment(e.target.value, "HH:mm:ss").format("HH:mm:ss")
                  )
                }
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
                  candidateNo == 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
                onClick={decreaseCanditateNo}
              >
                <AiOutlineMinus />
              </div>
              <input
                type="text"
                value={candidateNo}
                className="w-10 outline-none text-center"
              />
              <div
                className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                onClick={handleCandidateNo}
              >
                <AiOutlinePlus />
              </div>
            </div>
          </div>

          {votarPlan === "Free Votar" && (
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
                    value={numberofFreeVote}
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
              <div className=" flex items-center gap-4 mt-[34px]">
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
                    <div
                      className={`w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer ${
                        pricePerVote == 0
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-1 cursor-pointer"
                      }`}
                      onClick={votingPriceDecrement}
                    >
                      <AiOutlineMinus />
                    </div>
                    <input
                      type="text"
                      value={pricePerVote}
                      className="w-10 outline-none text-center"
                    />
                    <div
                      className="w-10 h-10 flex justify-center items-center bg-[#015CE9] text-white rounded cursor-pointer"
                      onClick={votingPriceIncrement}
                    >
                      <AiOutlinePlus />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

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
    </div>
  );
};

export default Details;
