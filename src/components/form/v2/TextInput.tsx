import { forwardRef, useId } from "react";

import {
  getInputState,
  inputVariants,
} from "@/constants/varaints/inputVariants";
import { cn } from "@/lib/cn";

import { HelperText } from "./HelperText";
import { Label } from "./Label";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      hint,
      error,
      required,
      disabled,
      id,
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const state = getInputState(disabled, error);

    return (
      <div className={cn("flex flex-col", wrapperClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            required={required}
            disabled={disabled}
            error={error}
          >
            {label}
          </Label>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(inputVariants({ state }), className)}
          {...props}
        />

        {(error || hint) && (
          <HelperText
            id={`${inputId}-helper`}
            error={error}
            hint={hint}
            disabled={disabled}
          />
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
