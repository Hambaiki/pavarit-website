import {
  getInputState,
  labelVariants,
  requiredMarkVariants,
} from "@/constants/varaints/inputVariants";
import { cn } from "@/lib/cn";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function Label({
  children,
  required,
  disabled,
  error,
  className,
  ...props
}: LabelProps) {
  const state = getInputState(disabled, error);

  return (
    <label className={cn(labelVariants({ state }), className)} {...props}>
      {children}
      {required && (
        <span className={requiredMarkVariants({ state })} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
