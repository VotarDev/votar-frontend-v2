import React from "react";

const Button = ({
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: any) => {
  return (
    <button
      className={`${className} cursor-pointer text-center flex justify-center items-center lg:text-[17px] text-base `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;
