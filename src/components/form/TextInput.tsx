import React, { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

const TextInput = ({
  name,
  label,
  error,
  helperText,
  className = "",
  disabled = false,
  required = false,
  ...props
}: TextInputProps) => {
  return (
    <label htmlFor={name} className="flex flex-col space-y-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}{required && <span className="text-red">*</span>}
        </p>
      )}

      <input
        id={name}
        name={name}
        disabled={disabled}
        className={`h-12 w-full px-3 py-2 border rounded-md text-left text-sm outline-none transition-colors
          placeholder:text-sm placeholder:text-grey_light
          ${error ? "border-red" : "border-grey_light"} 
          ${
            error
              ? "focus:border-red"
              : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
          }
          ${disabled ? "bg-grey_background" : "bg-white"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </label>
  );
};

export default TextInput;
