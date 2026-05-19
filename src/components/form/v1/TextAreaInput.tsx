import { TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/cn";

interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    {
      name,
      label,
      error,
      helperText,
      className = "",
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <label htmlFor={name} className="flex flex-col space-y-2">
        {label && (
          <p className="text-sm font-medium text-form-text-value">
            {label}
            {required && (
              <span className="text-form-required-mark">&nbsp;*</span>
            )}
          </p>
        )}

        <textarea
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          className={cn(
            `w-full px-3 py-3 rounded-md text-left text-sm text-form-text-value outline-none transition-colors
          placeholder:text-sm placeholder:text-form-text-placeholder bg-form-field-bg border border-form-field-border ring-0`,
            error
              ? "border-form-field-error focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
              : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring",
            disabled
              ? "text-form-text-disabled bg-form-field-bg-disabled border-form-field-border-disabled cursor-not-allowed"
              : "",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-form-helper-error">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-form-helper-hint">{helperText}</p>
        )}
      </label>
    );
  }
);

TextAreaInput.displayName = "TextAreaInput";

export default TextAreaInput;
