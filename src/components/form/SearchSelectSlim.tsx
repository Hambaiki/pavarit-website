import { useRef, useState } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";

import FadeInOutContainer from "../container/FadeInOutContainer";

import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";

interface SearchSelectProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  className?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  dropdownPosition?: "top" | "bottom";
  options?: { value: string; label: string }[];
  onChange?: (value: string) => void;
}

const SearchSelectSlim = ({
  label,
  error,
  errorMessage,
  helperText,
  value = "",
  placeholder = "",
  disabled = false,
  required = false,
  dropdownPosition = "bottom",
  options = [],
  onChange,
}: SearchSelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [focus, setFocus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

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

      <div ref={dropdownRef} className={`relative h-8`}>
        <input
          placeholder={placeholder}
          disabled={disabled}
          onClick={toggleDropdown}
          value={
            focus
              ? searchValue
              : options.find((option) => option.value === value)?.label || ""
          }
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`flex items-center justify-between w-full h-full pr-3 pl-8 py-2 border rounded-md text-left text-sm outline-none transition-colors 
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
           ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        />

        <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" />

        {value && !disabled && (
          <button
            disabled={disabled}
            onClick={() => onChange && onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3"
          >
            <FaXmark />
          </button>
        )}

        <FadeInOutContainer
          visible={dropdownOpen && filteredOptions.length > 0}
          className={`absolute ${
            dropdownPosition === "top"
              ? "bottom-[calc(100%+0.1rem)]"
              : "top-[calc(100%+0.1rem)]"
          } right-0 z-10 flex flex-col max-h-48 w-full
            overflow-y-auto border border-grey_light
            divide-y divide-grey_light bg-white 
            shadow-md rounded-md`}
        >
          {filteredOptions.map((option) => (
            <button
              disabled={disabled}
              key={option.value}
              onClick={(e) => handleOptionChange(e, option.value)}
              className="flex items-center px-3 py-4 h-12 space-x-2 hover:bg-grey_background transition-colors"
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

export default SearchSelectSlim;
