import React from "react";
import { PiCaretDownBold } from "react-icons/pi";
import Select, {
  type DropdownIndicatorProps,
  components,
  IndicatorSeparatorProps,
  StylesConfig,
  GroupProps,
} from "react-select";

const InputSelect = ({
  placeholder,
  option,
  setOption,
  optionvalue,
  className,
}: any) => {
  const indicatorSeparatorStyle = {
    display: "none",
  };
  const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <PiCaretDownBold className="text-zinc-800" />
      </components.DropdownIndicator>
    );
  };
  const groupStyles = {
    background: "white",
    color: "#150E28",
  };

  const Group = (props: GroupProps) => (
    <div style={groupStyles}>
      <span {...props} />
    </div>
  );

  const IndicatorSeparator = ({ innerProps }: IndicatorSeparatorProps) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
  };

  const customStyles: StylesConfig = {
    control: (provided: Record<string, unknown>, state: any) => ({
      ...provided,
      borderBottom: "1px solid black",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      background: "rgba(255, 255, 255, 0.03)",
      borderRadius: 0,
      padding: 4,
      cursor: "pointer",
      "&:hover": {
        borderBottom: "1px solid black",
      },
      "&:focus": {
        borderBottom: "1px solid black",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      color: "#000",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
    }),
  };
  return (
    <div>
      <Select
        defaultValue={optionvalue}
        onChange={setOption}
        options={option}
        placeholder={placeholder}
        components={{ DropdownIndicator, IndicatorSeparator, Group }}
        className={className}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          borderRadius: 4,
          borderBottom: "1px solid black",
          colors: {
            ...theme.colors,
            primary25: "#ffffff",
            primary: "#ffffff",
            neutral50: "#ffffff",
          },
        })}
      />
    </div>
  );
};

export default InputSelect;
