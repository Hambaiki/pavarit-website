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
        <p className="text-sm font-medium text-form-text-value">
          {label}
          {required && <span className="text-form-required-mark">*</span>}
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
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm text-form-text-value outline-none transition-colors 
            placeholder:text-sm placeholder:text-form-text-placeholder
            ${error ? "border-form-field-error" : "border-form-field-border"} 
            ${
              error
                ? "focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
                : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring"
            }
            ${
              disabled
                ? "bg-form-field-bg-disabled text-form-text-disabled border-form-field-border-disabled"
                : "bg-form-field-bg"
            }
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
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm text-form-text-value outline-none transition-colors 
            placeholder:text-sm placeholder:text-form-text-placeholder
            ${error ? "border-form-field-error" : "border-form-field-border"} 
            ${
              error
                ? "focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
                : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring"
            }
            ${
              disabled
                ? "bg-form-field-bg-disabled text-form-text-disabled border-form-field-border-disabled"
                : "bg-form-field-bg"
            }
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
          className={`w-1/3 h-12 px-3 py-2 border rounded-md text-left text-sm text-form-text-value outline-none transition-colors 
            placeholder:text-sm placeholder:text-form-text-placeholder
            ${error ? "border-form-field-error" : "border-form-field-border"} 
            ${
              error
                ? "focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
                : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring"
            }
            ${
              disabled
                ? "bg-form-field-bg-disabled text-form-text-disabled border-form-field-border-disabled"
                : "bg-form-field-bg"
            }
          `}
        />
      </div>

      {error && <p className="text-sm text-form-helper-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-form-helper-hint">{helperText}</p>
      )}
    </label>
  );
};

export default DateInput;
