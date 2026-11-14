import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  Copy,
  Loader2,
  XCircle,
} from "lucide-react";
import { useCurrentUserId, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getUserData, updateProfile } from "@/utils/api";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import FormSection from "@/src/components/shared/form/FormSection";
import FormField from "@/src/components/shared/form/FormField";
import EmptyState from "@/src/components/shared/EmptyState";

interface ProfileForm {
  fullname: string;
  email: string;
  number: string;
  address: string;
  referralId: string;
  profilePicture: string;
}

const EMPTY_FORM: ProfileForm = {
  fullname: "",
  email: "",
  number: "",
  address: "",
  referralId: "",
  profilePicture: "",
};

const ProfileBody = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [userInput, setUserInput] = useState<ProfileForm>(EMPTY_FORM);
  const dispatch = useDispatch();
  const user = useUser();
  const router = useRouter();
  const USER_ID = useCurrentUserId();

  // Preview a newly chosen avatar, releasing the object URL afterwards.
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };

  const getUser = async () => {
    if (!USER_ID) return;
    const token = new Cookies().get("user-token");
    if (token) setAuthToken(token);
    setIsLoading(true);
    setError("");

    try {
      const { data } = await getUserData(USER_ID);
      if (data) {
        dispatch(userData(data));
        setUserInput({
          fullname: data.data.userName || "",
          email: data.data.email || "",
          number: data.data.phoneNumber || "",
          address: data.data.homeAddress || "",
          referralId: data.data.referal_id || "",
          profilePicture: data.data.profile_picture || "",
        });
        setIsVerified(data.data.email_verified);
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [USER_ID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Same fields as before; address and referral ID aren't part of the update.
      const { fullname, email, number } = userInput;
      const formData = new FormData();
      formData.append("userName", fullname);
      formData.append("country", "Nigeria");
      formData.append("phoneNumber", number);
      formData.append("email", email);
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const { data } = await updateProfile(formData, USER_ID);
      if (data) {
        toast.success(data.message);
        setSelectedImage(null);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e.message);
      console.log(e);
    } finally {
      setIsUpdating(false);
    }
    getUser();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userInput.referralId);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Copy operation failed. Please try again.");
    }
  };

  if (isLoading && !userInput.email) {
    return (
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description="We couldn't load your profile."
          action={
            <Button variant="outline" onClick={getUser}>
              Try again
            </Button>
          }
        />
      </Card>
    );
  }

  const avatarSrc =
    previewUrl || userInput.profilePicture || user?.user?.picture || "";
  const initials =
    userInput.fullname
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "V";

  const verificationBadge = isVerified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
      <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Unverified
    </span>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
      {/* Overview */}
      <Card className="flex flex-col items-center p-6 text-center">
        <label
          htmlFor="imageInput"
          className="group relative cursor-pointer"
          aria-label="Change profile photo"
        >
          <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-secondary text-2xl font-semibold text-primary ring-4 ring-white shadow-md">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </span>
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Camera className="h-4 w-4" aria-hidden="true" />
          </span>
        </label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {selectedImage && (
          <p className="mt-2 text-xs text-primary">
            New photo selected · save to apply
          </p>
        )}

        <h2 className="mt-4 text-lg font-semibold capitalize text-foreground">
          {userInput.fullname || "Your name"}
        </h2>
        <p className="mt-0.5 break-all text-sm text-muted-foreground">
          {userInput.email}
        </p>
        <div className="mt-2">{verificationBadge}</div>

        {userInput.referralId && (
          <div className="mt-6 w-full border-t border-border pt-5 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Referral ID
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
                {userInput.referralId}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy referral ID"
                className="shrink-0"
              >
                <Copy />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Details */}
      <form onSubmit={handleSubmit}>
        <FormSection
          title="Personal information"
          description="Keep your name and contact details up to date."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField label="Full name" htmlFor="fullname">
              <Input
                id="fullname"
                name="fullname"
                value={userInput.fullname}
                onChange={handleInputChange}
              />
            </FormField>
            <FormField label="Phone number" htmlFor="number" optional>
              <Input
                id="number"
                name="number"
                type="tel"
                value={userInput.number}
                onChange={handleInputChange}
              />
            </FormField>
            <FormField
              label="Email"
              htmlFor="email"
              className="md:col-span-2"
              hint={
                isVerified
                  ? undefined
                  : "Your email isn't verified yet. Sign in again to get a new verification code."
              }
            >
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userInput.email}
                  onChange={handleInputChange}
                  className="pr-28"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {verificationBadge}
                </span>
              </div>
            </FormField>
            <FormField
              label="Address"
              htmlFor="address"
              optional
              className="md:col-span-2"
            >
              <Input
                id="address"
                name="address"
                value={userInput.address}
                onChange={handleInputChange}
              />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 smm:flex-row smm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="min-w-[140px]"
            >
              {isUpdating && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
};

export default ProfileBody;
