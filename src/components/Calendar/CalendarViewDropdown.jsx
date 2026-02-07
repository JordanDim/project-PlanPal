import { useState } from "react";

export default function CalendarViewDropdown({ onViewChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleViewChange = (view) => {
    if (onViewChange) {
      onViewChange(view);
    } else {
      window.dispatchEvent(new CustomEvent('calendarViewChange', { detail: view }));
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-secondary"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Calendar Views
      </div>
      {isDropdownOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a onClick={() => handleViewChange("daily")}>Daily</a>
          </li>
          <li>
            <a onClick={() => handleViewChange("weekly")}>Weekly</a>
          </li>
          <li>
            <a onClick={() => handleViewChange("work-week")}>Work Week</a>
          </li>
          <li>
            <a onClick={() => handleViewChange("monthly")}>Monthly</a>
          </li>
          <li>
            <a onClick={() => handleViewChange("yearly")}>Yearly</a>
          </li>
        </ul>
      )}
    </div>
  );
}
