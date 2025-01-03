import { useRef, useState } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";

import FadeInOutContainer from "@/components/container/FadeInOutContainer";

import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

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
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <p className="text-sm font-medium">
          {label}
          {required && <span className="text-red">*</span>}
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
            text-left text-sm 
            outline-none transition-colors
            ${error ? "border border-red-500" : ""} 
            ${
              error
                ? "focus:border-red-500"
                : "focus:border-suzuha-teal-500 focus:ring-1 focus:ring-suzuha-teal-500"
            }
            ${
              disabled
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gray-800 cursor-pointer"
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
              overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
              divide-y divide-gray-700 bg-gray-800 
              shadow-md rounded-md`}
        >
          {options.map((option) => (
            <button
              type="button"
              disabled={disabled}
              key={option.value}
              onClick={(e) => handleOptionChange(e, option.value)}
              className="flex items-center px-4 py-3 space-x-2 hover:bg-gray-900 transition-colors"
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </FadeInOutContainer>
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
