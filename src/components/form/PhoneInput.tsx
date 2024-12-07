import { useRef, useState } from "react";
import Image from "next/image";
import { defaultCountries, FlagImage } from "react-international-phone";

import Icons from "@constants/icons";

import { useClickOutside } from "src/hooks/useClickOutside";

interface PhoneInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  phoneCode?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  dropdownPosition?: "top" | "bottom";
  onPhoneCodeChange?: (code: string) => void;
  onChange?: (value: string) => void;
}

const phoneCodes: { value: string; code: string; name: string }[] =
  defaultCountries.map((country) => ({
    value: country[2], // country[2] contains the dial code
    code: country[1], // country[1] contains the 2-letter country code (TH, US, etc)
    name: country[0], // country[0] contains the country name
  }));

const PhoneInput = ({
  label,
  error,
  helperText,
  phoneCode = "66",
  value = "",
  dropdownPosition = "bottom",
  onPhoneCodeChange,
  onChange,
  disabled = false,
  required = false,
}: PhoneInputProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = phoneCodes.find(
    (code) => code.value === (phoneCode || "66")
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handlePhoneCodeChange = (code: string) => {
    onPhoneCodeChange && onPhoneCodeChange(code);
    setDropdownOpen(false);
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
        <div className="absolute top-0 left-0 flex items-center h-full">
          <button
            disabled={disabled}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center h-full px-3 py-2 space-x-2"
          >
            {selectedCountry && (
              <FlagImage iso2={selectedCountry.code} className="w-5 h-5" />
            )}
            <Image
              src={Icons.ChevronDownGreySubtext}
              alt="chevron down"
              width={12}
              height={12}
            />
          </button>

          <div className="flex items-center w-10 h-full text-xs">
            {selectedCountry && `+${selectedCountry.value}`}
          </div>
        </div>

        <input
          disabled={disabled}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full h-full pl-28 pr-3 py-2 border rounded-md text-left text-sm outline-none transition-colors 
            placeholder:text-sm placeholder:text-grey_light 
            ${error ? "border-red" : "border-grey_light"} 
            ${
              error
                ? "focus:border-red"
                : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
            }
            ${disabled ? "bg-grey_background" : "bg-white"}
          `}
        />

        {dropdownOpen && (
          <div
            className={`absolute ${
              dropdownPosition === "top"
                ? "bottom-[calc(100%+0.25rem)]"
                : "top-[calc(100%+0.25rem)]"
            } right-0 z-10 flex flex-col max-h-48 w-full
              overflow-y-auto border border-grey_light
              divide-y divide-grey_light bg-white 
              shadow-md rounded-md`}
          >
            {phoneCodes.map((code, index) => (
              <button
                key={index}
                onClick={() => handlePhoneCodeChange(code.value)}
                className="flex items-center h-12 px-3 py-2 space-x-2 hover:bg-grey_background"
              >
                <FlagImage iso2={code.code} className="w-5 h-5" />
                <span className="text-sm">{code.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </div>
  );
};

export default PhoneInput;
