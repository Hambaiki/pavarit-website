import { InputHTMLAttributes } from "react";

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
        <p className="text-sm font-medium text-gray-400">
          {label}
          {required && <span className="text-red-500">&nbsp;*</span>}
        </p>
      )}

      <input
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full px-3 py-3 border rounded-md text-left text-sm outline-none transition-colors
          placeholder:text-sm placeholder:text-gray-400
          ${error ? "border-red" : "border-primary-gray-border"} 
          ${
            error
              ? "focus:border-red"
              : "focus:border-blue_primary focus:ring-1 focus:ring-suzuha-teal-500"
          }
          ${
            disabled
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gray-800"
          }
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
