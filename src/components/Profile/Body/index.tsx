import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import { MdEdit } from "react-icons/md";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getUserData } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { MdOutlineCancel } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import { updateProfile } from "@/utils/api";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { useDispatch } from "react-redux";

interface User {
  fullname: string;
  email: string;
  number: string;
  address: string;
  referralId: string;
  profilePicture: string;
}

const ProfileBody = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [userImage, setUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const users = useCurrentUser();
  const user = useUser();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [userInput, setUserInput] = useState<User>({
    fullname: "",
    email: "",
    number: "",
    address: "",
    referralId: "",
    profilePicture: "",
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };
  const handleInputChange = (e: any) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };

  console.log(selectedImage);

  const getUser = async () => {
    let userId;
    if (users.data.data._id) userId = users.data.data._id;
    if (users.data.data) userId = users.data.data;
    if (user.user.id) userId = user.user.id;
    // const userId = users.data.data._id
    //   ? users.data.data._id
    //   : users.data.data
    //   ? users.data.data
    //   : user.user.id;
    console.log(userId);
    if (users || user) setAuthToken(users.data ? users.data.data.cookie : null);
    setIsLoading(true);

    try {
      const { data } = await getUserData(userId);

      if (data) {
        dispatch(userData(data));
        setUserInput((prev) => ({
          ...prev,
          fullname: data.data.userName,
          email: data.data.email,
          number: data.data.phoneNumber ? data.data.phoneNumber : "",
          address: data.data.homeAddress ? data.data.homeAddress : "",
          referralId: data.data.referal_id ? data.data.referal_id : "",
          profilePicture: data.data.profile_picture,
        }));
        console.log(data.verified);
        setIsVerified(data.data.email_verified);

        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      setError(e.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const userId = users.data.data._id
        ? users.data.data._id
        : users.data.data;
      const { fullname, email, number, address, referralId } = userInput;
      const formData = new FormData();
      formData.append("userName", fullname);
      formData.append("country", "Nigeria");
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const { data } = await updateProfile(formData, userId);
      if (data) {
        console.log(data);
        toast.success(data.message);
        setIsUpdating(false);
      }
    } catch (e: any) {
      setIsUpdating(false);
      toast.error(e.message);
      console.log(e);
    }
    getUser();
  };
  const handleCopy = async () => {
    if (inputRef.current) {
      const selectedText = inputRef.current.value;

      try {
        await navigator.clipboard.writeText(selectedText);

        toast.success("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="my-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  if (error) {
    return <div className="my-10">Something went wrong</div>;
  }

  return (
    <div className="my-10 max-w-[35rem] mx-auto">
      <form>
        <div className="flex justify-center flex-col items-center">
          <label htmlFor="imageInput" className="relative">
            <Avatar
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : userInput.profilePicture
              }
              sx={{ width: 150, height: 150 }}
            />
            <div className="absolute bottom-3 right-[-5px] text-xl text-white cursor-pointer w-10 h-10 bg-[#015CE9] flex items-center justify-center rounded-full">
              <MdEdit />
            </div>
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="bg-[#015CE9] font-semibold  px-5 py-4 rounded-lg mt-5 text-white text-center relative max-w-[17rem] mx-auto">
          <div className="bg-card bg-center bg-cover opacity-30 w-full h-full absolute top-0 right-0 left-0 "></div>
          <div className="flex justify-between">
            <div className="z-20">
              <div className="">
                Unredeemed <br /> Referral
              </div>
              <div className="text-[40px]">02</div>
            </div>

            <div className="z-20">
              <div className="">
                Redeemed
                <br /> Referral
              </div>
              <div className="text-[40px]">15</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="fullname" className="font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              defaultValue={userInput.fullname}
              onChange={handleInputChange}
              className="h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <div className=" relative">
                <input
                  type="text"
                  name="email"
                  id="email"
                  defaultValue={userInput.email}
                  onChange={handleInputChange}
                  className="h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
                />
                {!isVerified ? (
                  <>
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-red-600">
                      <MdOutlineCancel />
                    </span>
                  </>
                ) : (
                  <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xl h-6 w-6 rounded-full flex justify-center items-center bg-[#00e239] text-white">
                    <GiCheckMark />
                  </span>
                )}
              </div>
              {!isVerified && (
                <div className="absolute right-[-90px] top-1/2 -translate-y-[20%] leading-none flex flex-col gap-2 text-red-600 text-sm">
                  <div className="">Unverified</div>
                  <div className="text-[#000] cursor-pointer">
                    Click to verify
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="number" className="font-semibold">
              Number
            </label>
            <input
              type="text"
              name="number"
              id="number"
              defaultValue={userInput.number}
              onChange={handleInputChange}
              className="h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="font-semibold">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={userInput.address}
              onChange={handleInputChange}
              className="h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="referralId" className="font-semibold">
              Referral ID
            </label>
            <div className="relative">
              <input
                type="text"
                name="referralId"
                id="referralId"
                onChange={handleInputChange}
                defaultValue={userInput.referralId}
                ref={inputRef}
                className="h-[48px] w-full p-4 rounded border border-[#1e1e1e] outline-none"
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 right-4 text-xl cursor-pointer"
                onClick={handleCopy}
              >
                <IoCopy />
              </span>
            </div>
          </div>
        </div>
      </form>
      <div className="flex gap-4 justify-end smm:flex-row flex-col my-10">
        <div>
          <button
            className="w-[200px] flex justify-center items-center gap-2 p-[10px] border border-[#015CE9] rounded-lg text-[#015CE9] lg:text-[18px] text-base h-[52px]"
            onClick={() => router.back()}
          >
            <span></span>
            Back To Home
          </button>
        </div>
        <div>
          <button
            className="w-[200px] flex justify-center items-center gap-2 p-[10px] bg-[#015CE9] rounded-lg text-[#f3f3f3] lg:text-[18px] text-base h-[52px]"
            disabled={isUpdating}
            onClick={handleSubmit}
          >
            {isUpdating && <CircularProgress color="inherit" size={20} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBody;
