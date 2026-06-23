import { cva } from "class-variance-authority";

export type InputState = "default" | "error" | "disabled";

export const inputVariants = cva(
  [
    "w-full rounded-lg border bg-form-field-bg px-3 py-2.5 text-sm text-form-text-value",
    "placeholder:text-form-text-placeholder transition-all duration-150 ease-in-out outline-none",
  ],
  {
    variants: {
      state: {
        default:
          "border-form-field-border focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring",
        error:
          "border-form-field-error focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring",
        disabled:
          "border-form-field-border-disabled bg-form-field-bg-disabled text-form-text-disabled placeholder:text-form-text-disabled cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// Textarea-specific extension (adds resize behaviour on top of inputVariants)
export const textareaVariants = cva("resize-y", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "resize-none",
    },
    resize: {
      none: "resize-none",
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
    },
  },
  defaultVariants: {
    state: "default",
    resize: "vertical",
  },
});

// Select-specific extension - (removes native arrow, adds right padding for custom chevron)
export const selectVariants = cva("appearance-none pr-9", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const fieldTextVariants = cva("", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "text-form-text-disabled",
    },
    tone: {
      value: "text-form-text-value",
      placeholder: "text-form-text-placeholder",
    },
  },
  compoundVariants: [
    {
      state: "disabled",
      tone: "value",
      className: "text-form-text-disabled",
    },
    {
      state: "disabled",
      tone: "placeholder",
      className: "text-form-text-disabled",
    },
  ],
  defaultVariants: {
    state: "default",
    tone: "value",
  },
});

export const labelVariants = cva("block text-sm mb-1.5 text-form-text-value", {
  variants: {
    state: {
      default: "",
      error: "",
      disabled: "text-form-text-disabled",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const requiredMarkVariants = cva("ml-0.5", {
  variants: {
    state: {
      default: "text-form-required-mark",
      error: "text-form-helper-error",
      disabled: "text-form-text-disabled",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const helperTextVariants = cva("mt-1.5 text-xs", {
  variants: {
    state: {
      default: "text-form-helper-hint",
      error: "text-form-helper-error",
      disabled: "text-form-text-disabled",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const selectChevronVariants = cva(
  "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform",
  {
    variants: {
      state: {
        default: "text-form-text-placeholder",
        error: "text-form-text-placeholder",
        disabled: "text-form-text-disabled",
      },
      open: {
        true: "rotate-180",
        false: "rotate-0",
      },
    },
    defaultVariants: {
      state: "default",
      open: false,
    },
  }
);

export const selectMenuVariants = cva(
  "absolute z-50 mt-2 w-full rounded-xl border bg-form-menu-bg shadow-lg p-1 space-y-1 outline-none",
  {
    variants: {
      state: {
        default: "border-form-menu-border",
        error: "border-form-field-error",
        disabled: "border-form-field-border-disabled",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export const selectOptionVariants = cva(
  "flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg cursor-pointer select-none transition-colors",
  {
    variants: {
      active: {
        true: "bg-form-option-active",
        false: "",
      },
      selected: {
        true: "text-form-text-value font-medium",
        false: "text-form-text-value",
      },
      disabled: {
        true: "bg-transparent text-form-text-disabled cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      selected: false,
      disabled: false,
    },
  }
);

export function getInputState(disabled?: boolean, error?: string) {
  if (disabled) return "disabled" as const;
  if (error) return "error" as const;
  return "default" as const;
}
