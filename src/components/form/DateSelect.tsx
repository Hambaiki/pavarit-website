import Image from "next/image";
import React, { useRef, useState } from "react";

import { format } from "date-fns";

import Icons from "@constants/icons";

import { useClickOutside } from "src/hooks/useClickOutside";

import AbsoluteChildContainer from "../container/AbsoluteChildContainer";
import Calendar from "./Calendar";
import FadeInOutContainer from "../container/FadeInOutContainer";

interface DateSelectProps {
  className?: string;
  name?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  value?: Date | null;
  yPositing?: "top" | "bottom";
  xPositing?: "right" | "left";
  onSelect?: (date: Date) => void;
}

const DateSelect = ({
  name,
  label,
  error,
  helperText,
  className = "",
  disabled = false,
  required = false,
  value,
  yPositing = "bottom",
  xPositing = "left",
  onSelect,
  ...props
}: DateSelectProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);

  useClickOutside(calendarRef, () => setCalendarOpen(false));

  const handleSelectDate = (
    selected: Date | null | [Date | null, Date | null]
  ) => {
    setCalendarOpen(false);
    onSelect?.(selected as Date);
  };

  return (
    <label className="flex flex-col space-y-2">
      {label && (
        <p className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red">*</span>}
        </p>
      )}

      <div ref={parentRef} className="relative">
        <input
          id={name}
          name={name}
          disabled={disabled}
          type="button"
          value={value ? format(value, "dd/MM/yyyy") : ""}
          onClick={() => setCalendarOpen(true)}
          className={`h-12 w-full px-3 py-2 border rounded-md text-left text-sm outline-none transition-colors
          placeholder:text-sm placeholder:text-grey_light
          ${error ? "border-red" : "border-grey_light"} 
          ${
            error
              ? "focus:border-red"
              : "focus:border-blue_primary focus:ring-1 focus:ring-blue_primary"
          }
          ${disabled ? "bg-grey_background" : "bg-white"}
          ${className}
        `}
          {...props}
        />

        {!value && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-grey_light pointer-events-none">
            DD/MM/YYYY
          </span>
        )}

        <FadeInOutContainer
          visible={calendarOpen}
          className={`absolute z-10
            ${
              yPositing === "top"
                ? "bottom-[calc(100%+0.25rem)]"
                : "top-[calc(100%+0.25rem)]"
            } 
            ${xPositing === "right" ? "right-0" : "left-0"}`}
        >
          <div ref={calendarRef} className="mt-2">
            <Calendar
              applyButton
              yearRange={[
                new Date().getFullYear() - 2,
                new Date().getFullYear(),
              ]}
              selectedDate={value}
              onApply={handleSelectDate}
            />
          </div>
        </FadeInOutContainer>

        <Image
          src={Icons.CalendarPrimaryBlue}
          alt="calendar"
          width={24}
          height={24}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>

      {error && <p className="text-sm text-red">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-grey_faded">{helperText}</p>
      )}
    </label>
  );
};

export default DateSelect;
