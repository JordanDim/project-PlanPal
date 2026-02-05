import { useState, useEffect, useContext } from "react";
import DayCalendar from "./DayCalendar";
import WeekCalendar from "./WeekCalendar";
import WorkWeekCalendar from "./WorkWeekCalendar";
import MonthCalendar from "./MonthCalendar";
import YearCalendar from "./YearCalendar";
import { displayMyEvents } from "../../services/event.service";
import { AppContext } from "../../context/AppContext";

export default function Calendar() {
  const [view, setView] = useState("daily");
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { userData, loading: userLoading } = useContext(AppContext);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userLoading && userData) {
        const myEvents = await displayMyEvents(userData.handle);
        setEvents(myEvents);
      }
    };

    fetchEvents();
  }, [userData, userLoading]);

  useEffect(() => {
    const handleViewChange = (event) => {
      setView(event.detail);
    };

    window.addEventListener('calendarViewChange', handleViewChange);
    return () => {
      window.removeEventListener('calendarViewChange', handleViewChange);
    };
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setView("daily");
  };

  const renderView = () => {
    switch (view) {
      case "daily":
        return (
          <DayCalendar
            events={events}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        );
      case "weekly":
        return <WeekCalendar events={events} onDateClick={handleDateChange} />;
      case "work-week":
        return (
          <WorkWeekCalendar events={events} onDateClick={handleDateChange} />
        );
      case "monthly":
        return <MonthCalendar events={events} onDateClick={handleDateChange} />;
      case "yearly":
        return <YearCalendar events={events} onDateClick={handleDateChange} />;
      default:
        return <MonthCalendar />;
    }
  };

  return (
    <div className="calendar-container p-4">
      {renderView()}
    </div>
  );
}
