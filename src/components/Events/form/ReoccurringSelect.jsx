import PropTypes from "prop-types";
import { ArrowDown } from "../../../common/helpers/icons.jsx";

export default function ReoccurringSelect({
  value,
  onUpdate,
  isOpen,
  onToggle,
  finalDate = "",
  isIndefinite,
  onFinalDateChange,
  onIndefiniteChange,
}) {
  const recurrenceOptions = [
    { value: "never", label: "Never" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const selectedOption = recurrenceOptions.find(
    (option) => option.value === value
  );

  const handleSelect = (option) => {
    if (["weekly", "monthly", "yearly"].includes(option.value)) {
      onFinalDateChange("");
      onIndefiniteChange(false);
    }
    onUpdate(option.value);
    onToggle(false);
  };

  return (
    <div className="mb-4">
      <label htmlFor="reoccurring-option" className="block text-sm font-medium">
        Reoccurring:
      </label>
      <div className="mt-1 relative">
        <button
          type="button"
          className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left sm:text-sm"
          onClick={() => onToggle(!isOpen)}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : "Select Occurrence"}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ArrowDown />
          </span>
        </button>
        {isOpen && (
          <div
            className="origin-top-right absolute mt-1 w-full rounded-md backdrop-blur-lg bg-white/10 ring-1 text-black ring-black ring-opacity-5"
            style={{ zIndex: 999 }}
          >
            {recurrenceOptions.map((option) => (
              <div
                key={option.value}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                onClick={() => handleSelect(option)}
              >
                <span className="block truncate">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {["weekly", "monthly", "yearly"].includes(value) && (
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isIndefinite}
              onChange={(e) => onIndefiniteChange(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <label className="ml-2 text-sm font-medium">Indefinitely</label>
          </div>
          {!isIndefinite && (
            <>
              <label
                htmlFor="final-date"
                className="block text-sm font-medium mt-2"
              >
                Final Date:
              </label>
              <input
                type="date"
                id="final-date"
                className="mt-1 block w-full rounded-md shadow-sm sm:text-sm"
                value={finalDate}
                onChange={(e) => onFinalDateChange(e.target.value)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

ReoccurringSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  finalDate: PropTypes.string,
  isIndefinite: PropTypes.bool.isRequired,
  onFinalDateChange: PropTypes.func.isRequired,
  onIndefiniteChange: PropTypes.func.isRequired,
};
