import React from "react";
import Select, { type StylesConfig } from "react-select";
import type { OptionTypes } from "@/utils/types";

export const COLOR_OPTIONS: OptionTypes[] = [
  { value: "#EF4444", label: "Red" },
  { value: "#F97316", label: "Orange" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EAB308", label: "Yellow" },
  { value: "#84CC16", label: "Lime" },
  { value: "#22C55E", label: "Green" },
  { value: "#10B981", label: "Emerald" },
  { value: "#14B8A6", label: "Teal" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#0EA5E9", label: "Sky Blue" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#A855F7", label: "Purple" },
  { value: "#D946EF", label: "Fuchsia" },
  { value: "#EC4899", label: "Pink" },
  { value: "#F43F5E", label: "Rose" },
  { value: "#1E3A5F", label: "Navy" },
  { value: "#064E3B", label: "Forest Green" },
  { value: "#7C2D12", label: "Brown" },
  { value: "#1E1E1E", label: "Black" },
  { value: "#FFFFFF", label: "White" },
  { value: "#64748B", label: "Slate" },
  { value: "#9CA3AF", label: "Gray" },
  { value: "#FDE68A", label: "Pale Yellow" },
  { value: "#FECACA", label: "Light Pink" },
  { value: "#BBF7D0", label: "Mint" },
  { value: "#BAE6FD", label: "Light Blue" },
  { value: "#DDD6FE", label: "Lavender" },
];

const formatColorOption = (option: any) => (
  <div className="flex items-center gap-2">
    <span
      className="h-5 w-5 shrink-0 rounded-full border border-gray-300"
      style={{ backgroundColor: option.value }}
    />
    <span>{option.label}</span>
  </div>
);

const colorSelectStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 44,
    borderRadius: 6,
    borderColor: state.isFocused ? "#015CE9" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(1, 92, 233, 0.15)" : "none",
    fontSize: 14,
    "&:hover": { borderColor: state.isFocused ? "#015CE9" : "#cbd5e1" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (provided) => ({ ...provided, zIndex: 40, fontSize: 14 }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#eff6ff"
      : state.isFocused
        ? "#f8fafc"
        : "white",
    color: "#0f172a",
  }),
};

interface ColorSelectProps {
  /** The selected colour's hex value. */
  value?: string | null;
  onChange: (option: OptionTypes) => void;
  ariaLabel: string;
  isDisabled?: boolean;
}

/** Colour dropdown with swatches, used for the Votar Pro page colours. */
const ColorSelect = ({
  value,
  onChange,
  ariaLabel,
  isDisabled,
}: ColorSelectProps) => {
  // A colour saved before this list existed still shows, as its hex code.
  const selected = value
    ? (COLOR_OPTIONS.find(
        (o) => o.value.toLowerCase() === value.toLowerCase(),
      ) ?? {
        value,
        label: value,
      })
    : null;

  return (
    <Select
      value={selected}
      onChange={(option) => option && onChange(option as OptionTypes)}
      options={COLOR_OPTIONS}
      placeholder="Choose a colour"
      formatOptionLabel={formatColorOption}
      styles={colorSelectStyles}
      aria-label={ariaLabel}
      isDisabled={isDisabled}
    />
  );
};

export default ColorSelect;
