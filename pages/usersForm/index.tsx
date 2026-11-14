import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import Cookies from "universal-cookie";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Header from "@/src/components/BallotPage/Header";
import { getElectionById, getUserForm, votarResponse } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { ElectionDetails } from "@/utils/types";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import FormField from "@/src/components/shared/form/FormField";
import DialogShell from "@/src/components/shared/DialogShell";

type FormFields = { id: string; name: string; phone: string; email: string };
type FieldErrors = Partial<Record<keyof FormFields | "subgroup", string>>;

const EMPTY: FormFields = { id: "", name: "", phone: "", email: "" };

/** The public voter registration form an organiser shares from Votar Forms. */
const UsersForm = () => {
  const router = useRouter();
  const { token, electionID } = router.query;
  const [options, setOptions] = useState<string[]>([]);
  const [subgroup, setSubgroup] = useState("");
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const [formData, setFormData] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const getElection = async () => {
      if (!electionID) return;
      const cookieToken = new Cookies().get("user-token");
      if (cookieToken) setAuthToken(cookieToken);
      setIsFetchElection(true);
      try {
        const { data } = await getElectionById({ election_id: electionID });
        if (data) setElection(data.data);
      } catch (e: any) {
        console.log(e);
        toast.error("An error occured");
      } finally {
        setIsFetchElection(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    const getForm = async () => {
      const cookieToken = new Cookies().get("user-token");
      if (cookieToken) setAuthToken(cookieToken);
      try {
        const { data } = await getUserForm(electionID as string);
        if (data?.data?.subgroup) setOptions(data.data.subgroup);
      } catch (error) {
        console.log(error);
      }
    };
    if (electionID) getForm();
  }, [electionID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!formData.id.trim()) next.id = "Enter your ID.";
    if (!formData.name.trim()) next.name = "Enter your name.";
    if (options.length > 0 && !subgroup)
      next.subgroup = "Choose your sub-group.";
    if (!formData.phone.trim()) next.phone = "Enter your phone number.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      next.email = "Enter a valid email address.";
    return next;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPendingFormData({
      id: formData.id,
      name: formData.name,
      subgroup: subgroup || undefined,
      phoneNumber: formData.phone,
      email: formData.email,
    });
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const response = await votarResponse(pendingFormData, token as string);
      if (response.data) {
        setSuccess(true);
        toast.success("Details Submitted Successfully");
        setFormData(EMPTY);
        setSubgroup("");
        setPendingFormData(null);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "We couldn't submit your details. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  const review = [
    ["ID", pendingFormData?.id],
    ["Name", pendingFormData?.name],
    ["Sub-group", pendingFormData?.subgroup ?? "—"],
    ["Phone", pendingFormData?.phoneNumber],
    ["Email", pendingFormData?.email],
  ];

  return (
    // `isolate` keeps the header's branding (drawn behind its parent) above
    // this page's background.
    <div className="isolate min-h-screen bg-slate-50 pb-16">
      {isFetchElection ? (
        <Skeleton className="h-56 w-full rounded-none" />
      ) : (
        // The election's branding, as set by the organiser.
        <Header electionDetails={election} />
      )}

      <div className="mx-auto mt-8 w-full max-w-xl px-4">
        {success ? (
          <Card className="p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Details submitted
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you. The election organiser will use these details to send
              you your voting credentials.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setSuccess(false)}
            >
              Submit another response
            </Button>
          </Card>
        ) : (
          <Card className="p-6 smm:p-8">
            <h1 className="text-xl font-semibold text-foreground">
              Voter registration
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Please fill in your details correctly. You&apos;ll be able to
              review them before submitting.
            </p>

            <form
              className="mt-6 space-y-5"
              onSubmit={handleOpenConfirm}
              noValidate
            >
              <FormField label="ID" htmlFor="id" required error={errors.id}>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  aria-invalid={!!errors.id || undefined}
                />
              </FormField>
              <FormField
                label="Name"
                htmlFor="name"
                required
                error={errors.name}
              >
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name || undefined}
                />
              </FormField>
              {options.length > 0 && (
                <FormField
                  label="Sub-group"
                  htmlFor="subgroup"
                  required
                  error={errors.subgroup}
                >
                  <select
                    id="subgroup"
                    value={subgroup}
                    onChange={(e) => {
                      setSubgroup(e.target.value);
                      setErrors((prev) => ({ ...prev, subgroup: undefined }));
                    }}
                    aria-invalid={!!errors.subgroup || undefined}
                    className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 aria-[invalid=true]:border-destructive"
                  >
                    <option value="">Select your sub-group</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}
              <FormField
                label="Phone number"
                htmlFor="phone"
                required
                error={errors.phone}
              >
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone || undefined}
                />
              </FormField>
              <FormField
                label="Email address"
                htmlFor="email"
                required
                error={errors.email}
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email || undefined}
                />
              </FormField>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                Submit details
              </Button>
            </form>
          </Card>
        )}
      </div>

      <DialogShell
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        labelledBy="confirm-details-title"
      >
        <h2
          id="confirm-details-title"
          className="text-lg font-semibold text-foreground"
        >
          Confirm your details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please review your details before submitting.
        </p>
        <dl className="mt-4 divide-y divide-border rounded-lg border border-border text-sm">
          {review.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-3 py-2.5">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="break-all text-right font-medium text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
            Go back
          </Button>
          <Button onClick={handleConfirmSubmit}>Confirm &amp; submit</Button>
        </div>
      </DialogShell>
    </div>
  );
};

export default UsersForm;
