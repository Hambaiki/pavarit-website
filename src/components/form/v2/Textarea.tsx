import { forwardRef, useId } from "react";

import {
  getInputState,
  inputVariants,
  textareaVariants,
} from "@/constants/varaints/inputVariants";
import { cn } from "@/lib/cn";

import { HelperText } from "./HelperText";
import { Label } from "./Label";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wrapperClassName?: string;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 4,
      resize = "vertical",
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

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            inputVariants({ state }),
            textareaVariants({ state, resize }),
            className
          )}
          {...props}
        />

        <HelperText
          id={`${inputId}-helper`}
          error={error}
          hint={hint}
          disabled={disabled}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
