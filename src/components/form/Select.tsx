import Icons from "@constants/icons";
import Image from "next/image";
import { useRef, useState } from "react";

import { useClickOutside } from "src/hooks/useClickOutside";
import FadeInOutContainer from "../container/FadeInOutContainer";

interface SelectProps {
  label?: string;
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
  error,
  helperText,
  value = "",
  placeholder = "",
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
    <div className="flex flex-col space-y-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red">*</span>}
        </p>
      )}

      <div ref={dropdownRef} className={`relative h-12`}>
        <button
          type="button"
          disabled={disabled}
          onClick={toggleDropdown}
          className={`flex items-center justify-between w-full h-full px-3 py-2 border rounded-md text-left text-sm outline-none transition-colors
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        >
          {options.find((option) => option.value === value)?.label || (
            <span className="text-sm text-grey_light">{placeholder}</span>
          )}
        </button>

        <Image
          src={Icons.ChevronDownGreySubtext}
          alt="chevron down"
          width={12}
          height={12}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3"
        />

        <FadeInOutContainer
          visible={dropdownOpen && options.length > 0}
          className={`absolute ${
            dropdownPosition === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]"
          } right-0 z-10 flex flex-col max-h-48 w-full
              overflow-y-auto border border-grey_light
              divide-y divide-grey_light bg-white 
              shadow-md rounded-md`}
        >
          {options.map((option) => (
            <button
              disabled={disabled}
              key={option.value}
              onClick={(e) => handleOptionChange(e, option.value)}
              className="flex items-center px-3 py-2 h-12 space-x-2 hover:bg-grey_background transition-colors"
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </FadeInOutContainer>
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
