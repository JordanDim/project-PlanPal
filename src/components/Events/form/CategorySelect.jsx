import PropTypes from "prop-types";
import { ArrowDown } from "../../../common/helpers/icons.jsx";

export default function CategorySelect({
  value,
  onUpdate,
  isOpen,
  onToggle,
  includeOther = false,
}) {
  const categoryOptions = includeOther
    ? [
        { value: "Entertainment", label: "Entertainment" },
        { value: "Sports", label: "Sports" },
        { value: "Culture & Science", label: "Culture & Science" },
        { value: "Other", label: "Other" },
      ]
    : [
        { value: "Entertainment", label: "Entertainment" },
        { value: "Sports", label: "Sports" },
        { value: "Culture & Science", label: "Culture & Science" },
      ];

  const selectedOption = categoryOptions.find(
    (option) => option.value === value
  );

  return (
    <div className="mb-4 relative">
      <label htmlFor="category" className="block text-sm font-medium">
        Category:
      </label>
      <div className="mt-1 relative">
        <button
          type="button"
          className="w-full rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none sm:text-sm"
          id="category"
          onClick={() => onToggle(!isOpen)}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : "Select Category"}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ArrowDown />
          </span>
        </button>
        {isOpen && (
          <div
            className="origin-top-right absolute mt-1 w-full rounded-md  backdrop-blur-lg bg-white/10 ring-1 text-black ring-black ring-opacity-5"
            style={{ zIndex: 999 }}
          >
            {categoryOptions.map((option) => (
              <div
                key={option.value}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:glass"
                onClick={() => {
                  onUpdate(option.value);
                  onToggle(false);
                }}
              >
                <span className="block truncate">{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CategorySelect.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  includeOther: PropTypes.bool,
};
