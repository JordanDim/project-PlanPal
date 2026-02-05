import { format, add, sub, startOfDay, endOfDay, getHours, getMinutes, parseISO } from "date-fns";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BASE } from "../../common/constants";
import {
  useCurrentTime,
  getHoursArray,
  getCategoryColor,
  getEventsForDay,
  getCurrentTimePosition,
  CalendarHeader,
  CalendarContainer,
  CurrentTimeIndicator,
} from "../../utils/calendarUtils.jsx";

function DayCalendar({ events, selectedDate, onDateChange }) {
  const currentTime = useCurrentTime();
  const navigate = useNavigate();

  const GAP_SIZE = 0.5;

  function previousDay() {
    const newSelectedDate = sub(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  function nextDay() {
    const newSelectedDate = add(selectedDate, { days: 1 });
    onDateChange(newSelectedDate);
  }

  const hours = getHoursArray(selectedDate);

  const currentHour = getHours(currentTime);
  const currentMinute = getMinutes(currentTime);
  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(currentTime, "yyyy-MM-dd");

  const allEventsForSelectedDay = getEventsForDay(events, selectedDate);

  return (
    <CalendarContainer>
      <CalendarHeader
        title={format(selectedDate, "EEEE, MMMM d, yyyy")}
        onPrevious={previousDay}
        onNext={nextDay}
        previousLabel="Previous day"
        nextLabel="Next day"
      />
      <div className="border p-4 relative overflow-hidden max-w-full">
        <div className="relative">
          {hours.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col justify-start border-t h-12"
            >
              <div className="w-16 text-right pr-2 text-xs">
                {format(hour, "HH:mm")}
              </div>
            </div>
          ))}
          {allEventsForSelectedDay.map((event, index) => {
            const eventStart = parseISO(
              `${event.startDate}T${event.startTime}`
            );
            const eventEnd = parseISO(`${event.endDate}T${event.endTime}`);

            const isPast = eventEnd < currentTime;

            const eventStartHour =
              eventStart < startOfDay(selectedDate)
                ? 0
                : getHours(eventStart);
            const eventStartMinute =
              eventStart < startOfDay(selectedDate)
                ? 0
                : getMinutes(eventStart);
            const startTop = (eventStartHour + eventStartMinute / 60) * 3;

            const eventEndHour =
              eventEnd > endOfDay(selectedDate) ? 24 : getHours(eventEnd);
            const eventEndMinute =
              eventEnd > endOfDay(selectedDate) ? 0 : getMinutes(eventEnd);
            const eventHeight =
              (eventEndHour + eventEndMinute / 60) * 3 - startTop;

            const eventWidth =
              100 / allEventsForSelectedDay.length - GAP_SIZE;
            const eventLeft =
              index * (100 / allEventsForSelectedDay.length + GAP_SIZE);

            const categoryColor = getCategoryColor(event.category, isPast);

            return (
              <div
                key={event.id}
                className={`absolute pl-16 pr-4 text-black text-xs rounded-lg shadow-lg cursor-pointer ${categoryColor}`}
                style={{
                  top: `${startTop}rem`,
                  height: `${eventHeight}rem`,
                  width: `calc(${eventWidth}% - ${GAP_SIZE}rem)`,
                  left: `${eventLeft}%`,
                  marginLeft: `${GAP_SIZE / 2}rem`,
                  marginRight: `${GAP_SIZE / 2}rem`,
                  opacity: isPast ? 0.5 : 1,
                }}
                onClick={() => navigate(`${BASE}events/${event.id}`)}
              >
                <div className="px-2 py-1">
                  <div className="font-semibold">{event.title}</div>
                  <div>
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </div>
            );
          })}
          {isToday && (
            <CurrentTimeIndicator topPosition={getCurrentTimePosition(currentTime)} leftOffset="4rem" />
          )}
        </div>
      </div>
    </CalendarContainer>
  );
}

DayCalendar.propTypes = {
  events: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
};

export default DayCalendar;
