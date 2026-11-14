import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";
import {
  updateAddressDetails,
  updateCardDetails,
} from "@/redux/features/cardDetailsForm/cardDetailsSlice";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import FormSection from "@/src/components/shared/form/FormSection";
import FormField from "@/src/components/shared/form/FormField";
import { cn } from "@/utils/cn";

const CARD_TYPES = ["MasterCard", "Visa", "Verve"];

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 aria-[invalid=true]:border-destructive";

export type CardFormErrors = Partial<Record<string, string>>;

/** Required fields for adding a card; returns a message per missing field. */
export const validateCardForm = (
  cardDetails: any,
  addressDetails: any,
): CardFormErrors => {
  const errors: CardFormErrors = {};
  const need = (value: string, key: string, message: string) => {
    if (!String(value ?? "").trim()) errors[key] = message;
  };
  need(cardDetails.nameOnCard, "nameOnCard", "Enter the name on the card");
  need(cardDetails.cardNumber, "cardNumber", "Enter the card number");
  need(cardDetails.expireDate, "expireDate", "Enter the expiry date");
  need(cardDetails.cvv, "cvv", "Enter the CVV");
  need(cardDetails.cardType, "cardType", "Select the card type");
  need(addressDetails.firstName, "firstName", "Enter your first name");
  need(addressDetails.addressLine1, "addressLine1", "Enter your address");
  need(addressDetails.city, "city", "Enter your city");
  return errors;
};

interface CardFormProps {
  /** Edit hides the number, expiry and CVV fields, as before. */
  mode: "add" | "edit";
  errors?: CardFormErrors;
}

/** Card details and billing address, stored in the cardForm Redux slice. */
const CardForm = ({ mode, errors = {} }: CardFormProps) => {
  const dispatch = useDispatch();
  const { cardDetails, addressDetails } = useSelector(
    (state: any) => state.cardForm,
  );
  const [countries, setCountries] = useState<string[]>([]);
  const isAdd = mode === "add";

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name")
      .then(({ data }) =>
        setCountries(
          data
            .map((country: any) => country.name.common as string)
            .sort((a: string, b: string) => a.localeCompare(b)),
        ),
      )
      .catch((error) => console.error(error));
  }, []);

  type ChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  const onCard: ChangeHandler = (e) => {
    dispatch(updateCardDetails({ [e.target.name]: e.target.value }));
  };
  const onAddress: ChangeHandler = (e) => {
    dispatch(updateAddressDetails({ [e.target.name]: e.target.value }));
  };

  const field = (
    name: string,
    label: string,
    value: string,
    onChange: ChangeHandler,
    props: Omit<React.ComponentProps<"input">, "ref"> & {
      required?: boolean;
      optional?: boolean;
      hint?: string;
    } = {},
  ) => {
    const { required, optional, hint, className, ...rest } = props;
    return (
      <FormField
        label={label}
        htmlFor={name}
        required={required}
        optional={optional}
        hint={hint}
        error={errors[name]}
        className={className}
      >
        <Input
          id={name}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          {...rest}
        />
      </FormField>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-secondary px-4 py-3 text-sm text-foreground">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p>
          Votar uses secure, encrypted technology to handle your card
          information. Where possible, we&apos;ve pre-filled the fields with
          your previously stored information.
        </p>
      </div>

      <FormSection
        title="Card details"
        description="The card you'd like to pay with."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {field("nameOnCard", "Name on card", cardDetails.nameOnCard, onCard, {
            required: isAdd,
            autoComplete: "cc-name",
            placeholder: "e.g. Ada Okafor",
          })}
          {isAdd &&
            field("cardNumber", "Card number", cardDetails.cardNumber, onCard, {
              required: true,
              inputMode: "numeric",
              autoComplete: "cc-number",
              placeholder: "0000 0000 0000 0000",
              className: "md:col-span-2",
            })}
          {field("cardName", "Bank name", cardDetails.cardName, onCard, {
            placeholder: "e.g. GTBank",
          })}
          <FormField
            label="Card type"
            htmlFor="cardType"
            required={isAdd}
            error={errors.cardType}
          >
            <select
              id="cardType"
              name="cardType"
              value={cardDetails.cardType}
              onChange={onCard}
              aria-invalid={!!errors.cardType}
              className={cn(
                selectClass,
                !cardDetails.cardType && "text-muted-foreground",
              )}
            >
              <option value="">Select your card type</option>
              {CARD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
          {isAdd && (
            <>
              {field("expireDate", "Expires on", cardDetails.expireDate, onCard, {
                required: true,
                autoComplete: "cc-exp",
                placeholder: "MM/YY",
              })}
              {field("cvv", "CVV", cardDetails.cvv, onCard, {
                required: true,
                type: "password",
                inputMode: "numeric",
                autoComplete: "cc-csc",
                maxLength: 4,
                placeholder: "•••",
                hint: "The 3 or 4 digits on the back of your card.",
              })}
            </>
          )}
        </div>

        <label
          htmlFor="defaultForApps"
          className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border p-4"
        >
          <span>
            <span className="block text-sm font-medium text-foreground">
              Use as default card
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              This card will be your default for marketplace payments, general
              payments and renewals.
            </span>
          </span>
          <Switch
            id="defaultForApps"
            checked={!!cardDetails.defaultForApps}
            onCheckedChange={(checked) =>
              dispatch(updateCardDetails({ defaultForApps: checked }))
            }
          />
        </label>
      </FormSection>

      <FormSection
        title="Billing address"
        description="The address your card is registered to."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {field("firstName", "First name", addressDetails.firstName, onAddress, {
            required: isAdd,
            autoComplete: "given-name",
          })}
          {field("lastName", "Last name", addressDetails.lastName, onAddress, {
            autoComplete: "family-name",
          })}
          {field(
            "addressLine1",
            "Address",
            addressDetails.addressLine1,
            onAddress,
            {
              required: isAdd,
              autoComplete: "address-line1",
              placeholder: "Street address",
              className: "md:col-span-2",
            },
          )}
          {field(
            "addressLine2",
            "Address line 2",
            addressDetails.addressLine2,
            onAddress,
            {
              optional: true,
              autoComplete: "address-line2",
              placeholder: "Apartment, suite, etc.",
              className: "md:col-span-2",
            },
          )}
          {field("city", "City", addressDetails.city, onAddress, {
            required: isAdd,
            autoComplete: "address-level2",
          })}
          {field("state", "State / Province", addressDetails.state, onAddress, {
            autoComplete: "address-level1",
          })}
          {field("zip", "ZIP / Postal code", addressDetails.zip, onAddress, {
            autoComplete: "postal-code",
          })}
          <FormField label="Country" htmlFor="country">
            <select
              id="country"
              name="country"
              value={addressDetails.country}
              onChange={onAddress}
              className={cn(
                selectClass,
                !addressDetails.country && "text-muted-foreground",
              )}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};

export default CardForm;
