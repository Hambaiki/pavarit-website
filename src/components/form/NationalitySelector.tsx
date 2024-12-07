import { useState, useRef, useEffect } from "react";
import { FlagImage } from "react-international-phone";
import nationalities from "i18n-nationality";
import Image from "next/image";

import { useClickOutside } from "src/hooks/useClickOutside";

import Icons from "@constants/icons";
import FadeInOutContainer from "../container/FadeInOutContainer";

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
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red">*</span>}
        </p>
      )}

      <div ref={dropdownRef} className={`relative h-12`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center w-full h-12 px-3 py-2 border rounded-md text-left text-sm outline-none transition-colors 
            placeholder:text-sm placeholder:text-grey_light 
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
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
          visible={dropdownOpen}
          className={`absolute ${
            dropdownPosition === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]"
          } right-0 z-10 flex flex-col max-h-48 w-full
            overflow-y-auto border border-grey_light
            divide-y divide-grey_light bg-white 
            shadow-md rounded-md`}
        >
          <div className="sticky top-0">
            <input
              type="text"
              placeholder="Search nationality"
              className={`h-12 w-full pl-12 pr-3 py-2 text-left text-sm outline-none transition-colors
                  placeholder:text-sm placeholder:text-grey_light focus:ring-0
                `}
              onChange={handleSearchChange}
            />

            <Image
              src={Icons.SearchGreySubtext}
              alt="search"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
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
                className="flex items-center w-full px-3 h-12 text-left hover:bg-grey_background transition"
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

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </div>
  );
};

export default FormNationalitySelector;
