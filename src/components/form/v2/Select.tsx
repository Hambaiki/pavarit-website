"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";
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
  maxDropdownHeight?: number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

interface DropdownPos {
  top: number;
  left: number;
  width: number;
  placement: "bottom" | "top";
}

const DROPDOWN_MAX_HEIGHT = 320;
const DROPDOWN_GAP = 8;

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
      maxDropdownHeight = DROPDOWN_MAX_HEIGHT,
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
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Portal position state
    const [dropdownPos, setDropdownPos] = useState<DropdownPos | null>(null);

    useImperativeHandle(ref, () => buttonRef.current!);
    // ---------------------------------------------------------------------------------------

    // NOTE: activeIndex is only relevant when dropdown is open
    const [activeIndex, setActiveIndex] = useState<number>(-1);

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

    // Calculate and update portal position whenever open or window changes
    const updatePosition = useCallback(() => {
      if (!open || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const placement: "bottom" | "top" =
        spaceBelow >= maxDropdownHeight || spaceBelow >= spaceAbove
          ? "bottom"
          : "top";

      const top =
        placement === "bottom"
          ? rect.bottom + DROPDOWN_GAP + window.scrollY
          : rect.top - DROPDOWN_GAP + window.scrollY;

      setDropdownPos({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
        placement,
      });
    }, [open, maxDropdownHeight]);

    useLayoutEffect(() => {
      updatePosition();
    }, [updatePosition]);

    useEffect(() => {
      if (!open) return;

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, updatePosition]);
    // ---------------------------------------------------------------------------------------

    // NOTE: close dropdown on outside click — check both the trigger container and portal list
    useEffect(() => {
      if (!open) return;

      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          !containerRef.current?.contains(target) &&
          !listRef.current?.contains(target)
        ) {
          close();
        }
      };

      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open, close]);

    // NOTE: close dropdown on focus out
    useEffect(() => {
      if (!open) return;

      const handleFocusOut = (e: FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (
          !containerRef.current?.contains(related) &&
          !listRef.current?.contains(related)
        ) {
          close();
        }
      };

      document.addEventListener("focusout", handleFocusOut);
      return () => document.removeEventListener("focusout", handleFocusOut);
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

    // NOTE: handle keyboard events on the dropdown
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

    const dropdown =
      open && dropdownPos
        ? createPortal(
            <ul
              ref={listRef}
              role="listbox"
              aria-label={label}
              onKeyDown={handleDropdownKeyDown}
              style={{
                position: "absolute",
                top:
                  dropdownPos.placement === "bottom"
                    ? dropdownPos.top
                    : undefined,
                bottom:
                  dropdownPos.placement === "top"
                    ? window.innerHeight + window.scrollY - dropdownPos.top
                    : undefined,
                left: dropdownPos.left,
                width: dropdownPos.width,
                maxHeight: maxDropdownHeight,
              }}
              className={cn(
                selectMenuVariants({ state }),
                "overflow-y-auto",
                // override the cva absolute/w-full since we use inline style positioning
                "mt-0! w-auto!"
              )}
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
                      {isSelected && <FaCheck size={16} />}
                    </span>

                    {opt.label}
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null;

    return (
      <div
        ref={containerRef}
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
            <FaChevronUp size={16} />
          </div>
        </div>

        {error || hint ? (
          <HelperText
            id={`${inputId}-helper`}
            error={error}
            hint={hint}
            disabled={disabled}
          />
        ) : null}

        {dropdown}
      </div>
    );
  }
);

Select.displayName = "Select";
