"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { FaCheck, FaChevronUp } from "react-icons/fa6";

import {
  fieldTextVariants,
  getInputState,
  inputVariants,
  selectChevronVariants,
  selectMenuVariants,
  selectOptionVariants,
  selectVariants,
} from "@/constants/varaints/inputVariants";
import { cn } from "@/lib/cn";

import { HelperText } from "./HelperText";
import { Label } from "./Label";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  className?: string;
  wrapperClassName?: string;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onChange,
      label,
      hint,
      error,
      required,
      disabled,
      placeholder = "Select…",
      options = [],
      className,
      wrapperClassName,
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    // NOTE: manage controlled vs uncontrolled value
    // If value is provided, use it as source of truth, otherwise fall back to internal state
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? value ?? ""
    );

    const selectedValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find((o) => o.value === selectedValue);
    // ---------------------------------------------------------------------------------------

    // NOTE: open state is always internal (uncontrolled)
    // since we don't expose any onOpenChange callback or similar to allow controlling it from outside
    // but we could easily change this in the future if we want to
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => buttonRef.current!);
    // ---------------------------------------------------------------------------------------

    // NOTE: activeIndex is only relevant when dropdown is open
    // so we reset it to -1 when closing the dropdown to avoid confusion. W
    // hen opening the dropdown, we set it to the selected option (or first non-disabled option)
    // so that keyboard navigation starts from there.
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    // NOTE: reset activeIndex when opening/closing dropdown or when options/selectedValue change
    useEffect(() => {
      if (!open) {
        setActiveIndex(-1);
        return;
      }

      const selectedIndex = options.findIndex(
        (o) => o.value === selectedValue && !o.disabled
      );

      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }, [open, selectedValue, options]);
    // ---------------------------------------------------------------------------------------

    // NOTE: close dropdown on outside click
    useEffect(() => {
      if (!open) return;

      const handler = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
          close();
        }
      };

      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open, close]);

    // NOTE: close dropdown on focus out (e.g. when tabbing away)
    useEffect(() => {
      if (!open) return;

      const handleFocusOut = (e: FocusEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.relatedTarget as Node)
        ) {
          close();
        }
      };

      containerRef.current?.addEventListener("focusout", handleFocusOut);

      return () =>
        containerRef.current?.removeEventListener("focusout", handleFocusOut);
    }, [open, close]);

    // NOTE: handle option selection (both click and keyboard)
    const select = (opt: SelectOption) => {
      if (opt.disabled) return;

      if (value === undefined) {
        setInternalValue(opt.value);
      }

      onChange?.(opt.value);
      close();
      buttonRef.current?.focus();
    };

    // NOTE: handle keyboard events on the trigger button
    // to open the dropdown and navigate options
    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ":
          e.preventDefault();
          setOpen(true);
          break;
        case "Escape":
          close();
          break;
      }
    };

    // NOTE: handle keyboard events on the dropdown for navigation and selection
    const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, options.length - 1));
          break;

        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;

        case "Enter": {
          e.preventDefault();
          const opt = options[activeIndex];
          if (opt && !opt.disabled) select(opt);
          break;
        }

        case "Escape":
        case "Tab":
          close();
          break;
      }
    };

    const state = getInputState(disabled, error);

    return (
      <div
        ref={containerRef}
        onKeyDown={handleDropdownKeyDown}
        className={cn("w-full flex flex-col", wrapperClassName)}
      >
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

        {/* Hidden native input for forms */}
        <input type="hidden" name={name} value={selectedValue} />

        {/* Trigger */}
        <div className="relative w-full">
          <button
            ref={buttonRef}
            id={inputId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              inputVariants({ state }),
              selectVariants({ state }),
              fieldTextVariants({
                state,
                tone: selectedOption ? "value" : "placeholder",
              }),
              "text-left cursor-pointer",
              className
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </button>

          {/* Chevron */}
          <div className={cn(selectChevronVariants({ state, open }))}>
            <FaChevronUp className="w-6 h-6" />
          </div>

          {/* Dropdown */}
          {open && (
            <ul
              role="listbox"
              aria-label={label}
              className={cn(selectMenuVariants({ state }))}
            >
              {options.map((opt, index) => {
                const isSelected = opt.value === selectedValue;
                const isActive = index === activeIndex;

                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(opt)}
                    className={cn(
                      selectOptionVariants({
                        active: isActive,
                        selected: isSelected,
                        disabled: !!opt.disabled,
                      })
                    )}
                  >
                    <span className="w-4 h-4 flex items-center justify-center">
                      {isSelected && <FaCheck className="w-6 h-6" />}
                    </span>

                    {opt.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

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

Select.displayName = "Select";
