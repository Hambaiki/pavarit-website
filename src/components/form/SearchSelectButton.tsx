import { useRef, useState } from "react";

import { useClickOutside } from "@/hooks/useClickOutside";

import FadeInOutContainer from "@/components/container/FadeInOutContainer";

import { FaMagnifyingGlass } from "react-icons/fa6";

interface SearchSelectProps {
  children?: React.ReactNode;
  className?: string;
  value?: string;
  yPositing?: "top" | "bottom";
  xPositing?: "left" | "right";
  options?: {
    value: string;
    label: string;
    abbreviation?: string;
    color?: string;
  }[];
  onChange?: (value: string) => void;
}

const SearchSelectButton = ({
  children,
  value = "",
  xPositing = "left",
  yPositing = "bottom",
  options = [],
  onChange,
}: SearchSelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState(value);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOptionChange = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();

    onChange && onChange(value);
    setSearchValue("");
    setDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent events
    setSearchValue("");
    setDropdownOpen((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div ref={dropdownRef} className={`relative`}>
        <button className="w-full" onClick={toggleDropdown}>
          {children}
        </button>

        <FadeInOutContainer
          visible={dropdownOpen}
          className={`absolute overflow-hidden ${
            yPositing === "top"
              ? "bottom-[calc(100%+0.25rem)]"
              : "top-[calc(100%+0.25rem)]"
          } ${
            xPositing === "right" ? "right-0" : "left-0"
          } z-10 flex flex-col w-80
            divide-y divide-grey_light
            border border-grey_light bg-white 
            shadow-md rounded-md`}
        >
          <div className="p-4">
            <p className="text-sm text-gray-700">Search Department</p>

            <div className="relative mt-2">
              <input
                type="text"
                className={`h-10 w-full pl-12 pr-3 py-2 text-left text-sm outline-none transition-colors
                    border border-grey_light rounded-md
                    placeholder:text-sm placeholder:text-grey_light focus:ring-0
                  `}
                onChange={handleSearchChange}
              />

              <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
          </div>

          <div className="divide-y divide-grey_light max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 &&
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => handleOptionChange(e, option.value)}
                  className="flex items-center w-full px-3 h-12 text-left hover:bg-grey_background transition"
                >
                  <div className="flex items-center justify-center text-sm">
                    <div
                      className="shrink-0 w-8 h-8 rounded-full font-bold text-xs text-white flex items-center justify-center"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.abbreviation}
                    </div>
                    <span className="ml-2 truncate">{option.label}</span>
                  </div>
                </button>
              ))}
          </div>
        </FadeInOutContainer>
      </div>
    </div>
  );
};

export default SearchSelectButton;
