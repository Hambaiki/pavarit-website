import { forwardRef, useId, useRef } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

import { HelperText } from "./HelperText";
import { Label } from "./Label";

export interface FileUploadProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  buttonLabel?: string;
  sizeHint?: string;
  wrapperClassName?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      hint,
      error,
      required,
      disabled,
      buttonLabel = "Upload file",
      sizeHint,
      id,
      className,
      wrapperClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const internalRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

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

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            type="button"
            size="sm"
            disabled={disabled}
            onClick={() => internalRef.current?.click()}
          >
            {buttonLabel}
          </Button>

          {sizeHint && <span className="text-sm">{sizeHint}</span>}
        </div>

        {/* Hidden native input */}
        <input
          ref={setRefs}
          id={inputId}
          type="file"
          disabled={disabled}
          aria-invalid={!!error}
          className={cn("sr-only", className)}
          onChange={onChange}
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

FileUpload.displayName = "FileUpload";
