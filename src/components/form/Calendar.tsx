import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  getYear,
  getMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSaturday,
  isSunday,
  isBefore,
} from "date-fns";

enum CalendarMode {
  MONTH = "month",
  YEAR = "year",
  DATE = "date",
  RANGE = "range",
}

interface CalendarProps {
  mode?: "date" | "range";
  initialMonth?: Date;
  selectedDate?: Date | null;
  selectedRange?: [Date | null, Date | null];
  yearRange?: [number, number];
  disabledDates?: (date: Date) => boolean;
  onDateSelect?: (date: Date | null) => void;
  onRangeSelect?: ([start, end]: [Date | null, Date | null]) => void;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  applyButton?: boolean;
  onApply?: (selected: Date | null | [Date | null, Date | null]) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  mode = "date",
  initialMonth = new Date(),
  selectedDate = null,
  selectedRange = [null, null],
  yearRange = [1900, new Date().getFullYear()],
  disabledDates = () => false,
  onDateSelect,
  onRangeSelect,
  onMonthChange,
  onYearChange,
  disablePastDates = false,
  disableFutureDates = false,
  applyButton = false,
  onApply,
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentDate, setCurrentDate] = useState<Date | null>(selectedDate);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>(
    CalendarMode.DATE
  );

  const [range, setRange] = useState<[Date | null, Date | null]>(selectedRange);

  // Get start and end of the current month
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);

  // Extend the view to include previous and next month dates
  const calendarStartDate = startOfWeek(startDate);
  const calendarEndDate = endOfWeek(endDate);

  // Get all days in the extended calendar view
  const daysInCalendar = eachDayOfInterval({
    start: calendarStartDate,
    end: calendarEndDate,
  });

  const isDisabled = (date: Date) => {
    if (disablePastDates && date < new Date()) return true;
    if (disableFutureDates && date > new Date()) return true;
    return disabledDates(date);
  };

  const handleDateSelect = (date: Date) => {
    if (isDisabled(date)) return;

    if (mode === "date") {
      setCurrentDate(date);
      onDateSelect?.(date);
    } else if (mode === "range") {
      const [start, end] = range;

      // Case 1: If date matches the start or end of the range
      if (start && isSameDay(date, start)) {
        // Deselect the start; use end as new start or clear if no end
        if (end) {
          setRange([end, null]);
          onRangeSelect?.([end, null]);
        } else {
          setRange([null, null]);
          onRangeSelect?.([null, null]);
        }
      } else if (end && isSameDay(date, end)) {
        // Deselect the end; use start as the new start or clear if no start
        if (start) {
          setRange([start, null]);
          onRangeSelect?.([start, null]);
        } else {
          setRange([null, null]);
          onRangeSelect?.([null, null]);
        }
      }
      // Case 2: If no start or end, or if date is not part of the range
      else if (!start || (start && end)) {
        setRange([date, null]);
        onRangeSelect?.([date, null]);
      }
      // Case 3: Add the second date to form a range
      else {
        const newRange = isBefore(date, start)
          ? ([date, start] as [Date | null, Date | null])
          : ([start, date] as [Date | null, Date | null]);
        setRange(newRange);
        onRangeSelect?.(newRange);
      }
    }
  };

  const handleMonthChange = (month: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), month, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(month);
    setCalendarMode(CalendarMode.DATE);
  };

  const handleYearChange = (year: number) => {
    const newMonth = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newMonth);
    onYearChange?.(year);
    setCalendarMode(CalendarMode.MONTH);
  };

  const handleApply = () => {
    if (mode === "date") {
      onApply?.(currentDate);
    } else if (mode === "range") {
      onApply?.(range);
    }
  };

  const isInRange = (date: Date): boolean => {
    const [start, end] = range;
    return start && end ? isWithinInterval(date, { start, end }) : false;
  };

  const handleStepMonth = (step: number, increment: boolean) => {
    setCurrentMonth((prevMonth) => {
      const nextMonth = addMonths(prevMonth, increment ? step : -step);
      if (yearRange) {
        const [minYear, maxYear] = yearRange;
        if (
          nextMonth.getFullYear() > maxYear ||
          nextMonth.getFullYear() < minYear
        ) {
          return prevMonth; // Prevent incrementing if out of range
        }
      }
      return nextMonth;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg text-sm w-80">
      {calendarMode === CalendarMode.DATE && (
        <div className="p-4">
          <header className="flex items-center justify-between">
            <button
              onClick={() => setCalendarMode(CalendarMode.MONTH)}
              className="flex items-center space-x-1 
              hover:text-grey_normal transition-colors"
            >
              <span className="font-semibold">
                {format(currentMonth, "MMMM")}
              </span>
              <span className="font-semibold">
                {format(currentMonth, "yyyy")}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
                strokeWidth={2}
              >
                <path d="M6 9l6 6l6 -6"></path>
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepMonth(1, false)}
                disabled={
                  yearRange &&
                  currentMonth.getFullYear() === yearRange[0] &&
                  currentMonth.getMonth() === 0
                }
                className="w-5 h-5 hover:text-grey_normal disabled:text-grey_light transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  strokeWidth="2"
                >
                  <path d="M15 6l-6 6l6 6"></path>
                </svg>
              </button>
              <button
                onClick={() => handleStepMonth(1, true)}
                disabled={
                  yearRange &&
                  currentMonth.getFullYear() === yearRange[1] &&
                  currentMonth.getMonth() === 11
                }
                className="w-5 h-5 hover:text-grey_normal disabled:text-grey_light transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  strokeWidth="2"
                >
                  <path d="M9 6l6 6l-6 6"></path>
                </svg>
              </button>
            </div>
          </header>
          <div className="grid grid-cols-7 mt-4">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-grey_normal mb-2">
                {day}
              </div>
            ))}

            {mode === "range" ? (
              <>
                {daysInCalendar.map((day, index) => {
                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth();
                  const isToday = isSameDay(day, new Date());
                  const isSelectedDay =
                    currentDate && isSameDay(day, currentDate);
                  const isStartOfRange = range[0] && isSameDay(day, range[0]);
                  const isEndOfRange = range[1] && isSameDay(day, range[1]);
                  const isInDateRange = isInRange(day);
                  const isWeekend = isSaturday(day) || isSunday(day);
                  return (
                    <div
                      key={`${index}-${day.toString()}-${day.getMonth()}`}
                      className={`flex justify-center p-1 mt-1 transition-colors ${
                        isInDateRange ? "bg-[#D9ECFF]" : ""
                      } ${
                        isStartOfRange || isSunday(day) ? "rounded-l-full" : ""
                      } ${
                        isEndOfRange || isSaturday(day) ? "rounded-r-full" : ""
                      }`}
                    >
                      <button
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled(day)}
                        className={`shrink-0 w-8 h-8 rounded-full transition-colors ${
                          isSelectedDay || isStartOfRange || isEndOfRange
                            ? "bg-[#0080FF] text-white"
                            : isCurrentMonth
                            ? "hover:bg-grey_faded"
                            : "text-grey_light"
                        } ${
                          isToday && isCurrentMonth ? "text-blue_vibrant" : ""
                        } ${
                          isWeekend && isCurrentMonth ? "text-grey_normal" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {daysInCalendar.map((day, index) => {
                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth();
                  const isToday = isSameDay(day, new Date());
                  const isSelectedDay =
                    currentDate && isSameDay(day, currentDate);
                  const isWeekend = isSaturday(day) || isSunday(day);
                  return (
                    <div
                      key={`${index}-${day.toString()}-${day.getMonth()}`}
                      className="flex justify-center p-1"
                    >
                      <button
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled(day)}
                        className={`shrink-0 w-8 h-8 rounded-full transition-colors ${
                          isSelectedDay
                            ? "bg-[#0080FF] text-white"
                            : isCurrentMonth
                            ? "hover:bg-grey_faded"
                            : "text-grey_light hover:bg-grey_faded/50"
                        } ${
                          isToday && isCurrentMonth ? "text-blue_vibrant" : ""
                        } ${
                          isWeekend && isCurrentMonth ? "text-grey_normal" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          {applyButton && (
            <div className="flex justify-end mt-2">
              <button
                className="px-8 py-2 bg-blue_primary hover:bg-blue_dark transition-colors text-white rounded-xl"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}

      {calendarMode === CalendarMode.MONTH && (
        <div className="p-4">
          <header>
            <button
              onClick={() => setCalendarMode(CalendarMode.YEAR)}
              className="flex items-center space-x-1 hover:text-grey_normal transition-colors"
            >
              <span className="font-semibold">
                {format(currentMonth, "yyyy")}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                width={16}
                height={16}
                strokeWidth={2}
              >
                <path d="M6 9l6 6l6 -6"></path>
              </svg>
            </button>
          </header>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleMonthChange(index)}
                className={`py-3 px-5 w-20 rounded-full transition-colors ${
                  getMonth(currentMonth) === index
                    ? "bg-[#7DB4E7] text-white"
                    : "hover:bg-grey_faded"
                }`}
              >
                {format(new Date(2020, index, 1), "MMM")}
              </button>
            ))}
          </div>
        </div>
      )}

      {calendarMode === CalendarMode.YEAR && (
        <div>
          <header className="font-semibold p-4 pb-2">
            {format(currentMonth, "yyyy")}
          </header>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-4 pt-2">
            {Array.from({ length: yearRange[1] - yearRange[0] + 1 }).map(
              (_, index) => {
                const year = yearRange[0] + index;
                return (
                  <button
                    key={year}
                    onClick={() => handleYearChange(year)}
                    className={`py-3 px-5 w-20 rounded-full transition-colors ${
                      getYear(currentMonth) === year
                        ? "bg-[#7DB4E7] text-white"
                        : "hover:bg-grey_faded"
                    }`}
                  >
                    {year}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
