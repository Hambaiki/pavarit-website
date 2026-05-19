import { useEffect, useRef, useState } from "react";

import nationalities from "i18n-nationality";
import { FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import { FlagImage } from "react-international-phone";

import FadeInOutContainer from "@/components/container/FadeInOutContainer";
import { useClickOutside } from "@/hooks/useClickOutside";

nationalities.registerLocale(require("i18n-nationality/langs/en.json"));

const allNationalities = nationalities.getNames("en");
const allNationalityOptions = Object.entries(allNationalities).map(
  ([code, name]) => ({
    label: allNationalities[name as keyof typeof allNationalities] || name,
    value: code,
  })
);

interface FormNationalitySelectorProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  dropdownPosition?: "top" | "bottom";
  onChange?: (value: string) => void;
}

const FormNationalitySelector = ({
  label,
  value,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  dropdownPosition = "bottom",
  onChange,
}: FormNationalitySelectorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = allNationalityOptions.find(
    (option) => option.value === value
  );

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  useEffect(() => {
    setSearchValue("");
  }, [dropdownOpen]);

  const handleOptionClick = (optionValue: string) => {
    onChange?.(optionValue);
    setDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <p className="text-sm font-medium text-form-text-value">
          {label}
          {required && <span className="text-form-required-mark">*</span>}
        </p>
      )}

      <div ref={dropdownRef} className={`relative h-12`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center w-full h-12 px-3 py-2 border rounded-md text-left text-sm text-form-text-value outline-none transition-colors 
            placeholder:text-sm placeholder:text-form-text-placeholder 
            ${error ? "border-form-field-error" : "border-form-field-border"} 
            ${
              error
                ? "focus:border-form-field-error focus:ring-2 focus:ring-form-field-error-ring"
                : "focus:border-form-field-focus focus:ring-2 focus:ring-form-field-focus-ring"
            }
            ${
              disabled
                ? "bg-form-field-bg-disabled text-form-text-disabled border-form-field-border-disabled"
                : "bg-form-field-bg"
            }
          `}
        >
          {selectedOption ? (
            <>
              <FlagImage
                iso2={selectedOption.value.toLowerCase()}
                className="w-5 h-5"
              />
              <span className="ml-2">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-sm text-form-text-placeholder">
              {placeholder}
            </span>
          )}
        </button>

        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3" />

        <FadeInOutContainer
          visible={dropdownOpen}
          className={`absolute ${
            dropdownPosition === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]"
          } right-0 z-10 flex flex-col max-h-48 w-full
            overflow-y-auto border border-form-menu-border
            divide-y divide-form-menu-border bg-form-menu-bg 
            shadow-md rounded-md`}
        >
          <div className="sticky top-0">
            <input
              type="text"
              placeholder="Search nationality"
              className={`h-12 w-full pl-12 pr-3 py-2 text-left text-sm text-form-text-value outline-none transition-colors
                  placeholder:text-sm placeholder:text-form-text-placeholder border-b border-form-menu-border focus:ring-0
                `}
              onChange={handleSearchChange}
            />

            <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>

          {allNationalityOptions
            .filter((option) =>
              option.label.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className="flex items-center w-full px-3 h-12 text-left text-form-text-value hover:bg-form-option-active transition"
              >
                <FlagImage
                  iso2={option.value.toLowerCase()}
                  className="w-5 h-5"
                />
                <span className="flex items-center ml-2 h-12 text-sm">
                  {option.label}
                </span>
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

export default FormNationalitySelector;
