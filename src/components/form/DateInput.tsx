import React, { InputHTMLAttributes } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  dayProps?: InputHTMLAttributes<HTMLInputElement>;
  monthProps?: InputHTMLAttributes<HTMLInputElement>;
  yearProps?: InputHTMLAttributes<HTMLInputElement>;
}

const DateInput = ({
  label,
  error,
  helperText,
  dayProps = {},
  monthProps = {},
  yearProps = {},
  disabled = false,
  required = false,
}: DateInputProps) => {
  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextInputRef: React.RefObject<HTMLInputElement>,
    prevInputRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      e.currentTarget.value.length === 0 &&
      prevInputRef
    ) {
      // Focus the previous input if backspace is pressed and current input is empty
      prevInputRef.current?.focus();
      return;
    }
    if (e.currentTarget.value.length === e.currentTarget.maxLength) {
      nextInputRef.current?.focus();
    }
  };

  const dayRef = React.useRef<HTMLInputElement>(null);
  const monthRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  return (
    <label className="flex flex-col space-y-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red">*</span>}
        </p>
      )}

      <div className="flex space-x-2">
        <input
          {...dayProps}
          id="day-input"
          ref={dayRef}
          type="text"
          maxLength={2}
          placeholder="DD"
          onKeyUp={(e) => handleKeyUp(e, monthRef, dayRef)}
          disabled={disabled}
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm outline-none transition-colors 
            placeholder:text-sm placeholder:text-grey_light
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        />
        <input
          {...monthProps}
          id="month-input"
          ref={monthRef}
          type="text"
          maxLength={2}
          placeholder="MM"
          onKeyUp={(e) => handleKeyUp(e, yearRef, dayRef)}
          disabled={disabled}
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm  outline-none transition-colors 
            placeholder:text-sm placeholder:text-grey_light
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        />
        <input
          {...yearProps}
          id="year-input"
          ref={yearRef}
          type="text"
          maxLength={4}
          placeholder="YYYY"
          onKeyUp={(e) => handleKeyUp(e, yearRef, monthRef)}
          disabled={disabled}
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm  outline-none transition-colors 
            placeholder:text-sm placeholder:text-grey_light
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        />
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </label>
  );
};

export default DateInput;
