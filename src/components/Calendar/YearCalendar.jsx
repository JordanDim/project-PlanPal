import { useState } from "react";
import PropTypes from "prop-types";
import {
  add,
  format,
  getDay,
  parse,
  startOfMonth,
  getDaysInMonth,
  sub,
  startOfToday,
} from "date-fns";
import { getEventsForDaySimple, CalendarHeader, CalendarContainer } from "../../utils/calendarUtils.jsx";

export default function YearCalendar({ onDateClick, events }) {
  const today = startOfToday();
  const [currentYear, setCurrentYear] = useState(format(today, "yyyy"));

  const startOfCurrentYear = parse(currentYear, "yyyy", new Date());

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthStart = add(startOfCurrentYear, { months: i });
    const daysInMonth = getDaysInMonth(monthStart);
    const firstDayOfWeek = (getDay(startOfMonth(monthStart)) + 6) % 7;
    const monthDays = Array.from(
      { length: daysInMonth + firstDayOfWeek },
      (_, i) => {
        const day = add(startOfMonth(monthStart), { days: i - firstDayOfWeek });
        const eventsForDay = getEventsForDaySimple(events, day);
        const hasEvents = eventsForDay.length > 0;

        if (hasEvents) {
          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex justify-center items-center ${
                i >= firstDayOfWeek
                  ? "text-gray-700 cursor-pointer"
                  : "bg-transparent"
              }`}
              onClick={() => i >= firstDayOfWeek && onDateClick(day)}
              style={
                i >= firstDayOfWeek
                  ? {
                      backgroundColor: "red",
                      opacity: 0.4,
                      color: "white",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                    }
                  : {}
              }
            >
              {i >= firstDayOfWeek ? format(day, "d") : ""}
            </div>
          );
        } else {
          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex justify-center items-center ${
                i >= firstDayOfWeek
                  ? "text-gray-700 cursor-pointer"
                  : "bg-transparent"
              }`}
              onClick={() => i >= firstDayOfWeek && onDateClick(day)}
            >
              {i >= firstDayOfWeek ? format(day, "d") : ""}
            </div>
          );
        }
      }
    );

    return (
      <div key={format(monthStart, "MMM-yyyy")}>
        <div className="text-lg font-semibold mb-2">
          {format(monthStart, "MMMM")}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div key={index} className="text-sm font-semibold text-center">
              {day}
            </div>
          ))}
          {monthDays}
        </div>
      </div>
    );
  });

  function previousYear() {
    const firstDayPreviousYear = sub(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayPreviousYear, "yyyy"));
  }

  function nextYear() {
    const firstDayNextYear = add(startOfCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  return (
    <CalendarContainer>
      <CalendarHeader
        title={currentYear}
        onPrevious={previousYear}
        onNext={nextYear}
        previousLabel="Previous year"
        nextLabel="Next year"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {months}
      </div>
    </CalendarContainer>
);

}

YearCalendar.propTypes = {
  onDateClick: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
};
