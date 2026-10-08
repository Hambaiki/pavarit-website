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
        <p className="text-sm font-medium text-content-secondary">
          {label}
          {required && <span className="text-danger">&nbsp;*</span>}
        </p>
      )}

      <input
        id={name}
        name={name}
        disabled={disabled}
        className={`w-full px-3 py-3 rounded-md text-left text-sm outline-none transition-colors
          placeholder:text-sm placeholder:text-content-subtle bg-canvas ring-0
          ${error ? "focus:border-danger" : "focus:ring-1 focus:ring-transparent"}
          ${disabled ? "text-content-muted cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-content-muted">{helperText}</p>
      )}
    </label>
  );
};

export default TextInput;
