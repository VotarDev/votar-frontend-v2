import React, { useState, useEffect } from "react";
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
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";

const Details = ({
  setElection,
  election,
  setImage,
  imageFile,
  backgroundImage,
  setBackground,
  primaryColor,
  setPrimaryColor,
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
}: any) => {
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);
  const [backgroundUrl, setbackgroundUrl] = useState(null);

  const handleImageUpload = (e: any, image: any, url: any) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
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
  // console.log(selectedImgUrl);

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

  const primaryColors = [
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
  ];

  const secondaryColors = [
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
                  handleImageUpload(e, setImage, setSelectedImgUrl)
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
                  onChange={(e) =>
                    handleImageUpload(e, setBackground, setbackgroundUrl)
                  }
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
                  defaultValue={primaryColor}
                  onChange={setPrimaryColor}
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
                  onChange={(e) => setDate(e.target.value)}
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
                  onChange={(e) => setEndDate(e.target.value)}
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
        </form>
      </div>
    </div>
  );
};

export default Details;
