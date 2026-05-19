import { useRef, useState } from "react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

import FadeInOutContainer from "@/components/container/FadeInOutContainer";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

interface SelectProps {
  label?: string;
  name?: string;
  error?: string;
  helperText?: string;
  className?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  dropdownPosition?: "top" | "bottom";
  xPositing?: "right" | "left";
  yPositing?: "top" | "bottom";
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

const Select = ({
  label,
  name,
  error,
  helperText,
  value = "",
  placeholder = "",
  className = "",
  disabled = false,
  required = false,
  dropdownPosition = "bottom",
  xPositing = "left",
  yPositing = "top",
  options = [],
  onChange,
}: SelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleOptionChange = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();

    onChange && onChange(value);
    setDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent events
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className={cn(`flex flex-col gap-2`, className)}>
      {label && (
        <p className="text-sm font-medium text-form-text-value">
          {label}
          {required && <span className="text-form-required-mark">*</span>}
        </p>
      )}

      <div ref={dropdownRef} className={`relative`}>
        <input
          // type="button"
          placeholder={placeholder}
          name={name}
          value={value}
          disabled={disabled}
          onClick={toggleDropdown}
          className={`flex items-center justify-between 
            w-full h-full px-3 py-2 rounded-md 
            text-left text-sm text-form-text-value 
            placeholder:text-form-text-placeholder
            outline-none transition-colors
            ${error ? "border border-form-field-error" : ""} 
            ${
              error
                ? "focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
                : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring"
            }
            ${
              disabled
                ? "bg-form-field-bg-disabled text-form-text-disabled border border-form-field-border-disabled cursor-not-allowed"
                : "bg-form-field-bg border border-form-field-border cursor-pointer"
            }
          `}
        />

        {dropdownOpen ? (
          <FaChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3" />
        ) : (
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3" />
        )}

        <FadeInOutContainer
          visible={dropdownOpen && options.length > 0}
          className={`absolute ${
            dropdownPosition === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]"
          } right-0 z-10 flex flex-col max-h-48 w-full
              overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
              divide-y divide-form-menu-border bg-form-menu-bg border border-form-menu-border
              shadow-md rounded-md`}
        >
          {options.map((option) => (
            <button
              type="button"
              disabled={disabled}
              key={option.value}
              onClick={(e) => handleOptionChange(e, option.value)}
              className="flex items-center px-4 py-3 space-x-2 text-form-text-value hover:bg-form-option-active transition-colors"
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </FadeInOutContainer>
      </div>

      {error && <p className="text-sm text-form-helper-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-form-helper-hint">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
