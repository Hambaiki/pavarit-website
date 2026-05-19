import {
  type InputState,
  getInputState,
  helperTextVariants,
} from "@/constants/varaints/inputVariants";
import { cn } from "@/lib/cn";

interface HelperTextProps extends React.HTMLAttributes<HTMLDivElement> {
  inputId?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

interface HelperTextItemProps extends React.HTMLAttributes<HTMLParagraphElement> {
  state?: InputState;
}

export function HintText({
  children,
  state = "default",
  className,
  ...props
}: HelperTextItemProps) {
  return (
    <p className={cn(helperTextVariants({ state }), className)} {...props}>
      {children}
    </p>
  );
}

export function ErrorText({
  children,
  state = "error",
  className,
  ...props
}: HelperTextItemProps) {
  return (
    <p className={cn(helperTextVariants({ state }), className)} {...props}>
      {children}
    </p>
  );
}

export function HelperText({
  id,
  error,
  hint,
  disabled,
  className,
  ...props
}: HelperTextProps) {
  const state = getInputState(disabled, error);

  return (
    <div id={`${id}-container`} className={cn("h-7", className)} {...props}>
      {error ? (
        <ErrorText id={`${id}-error`} state={state} className="line-clamp-1">
          {error}
        </ErrorText>
      ) : hint ? (
        <HintText id={`${id}-hint`} state={state} className="line-clamp-1">
          {hint}
        </HintText>
      ) : null}
    </div>
  );
}
