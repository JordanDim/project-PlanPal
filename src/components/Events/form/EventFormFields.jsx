import PropTypes from "prop-types";

export default function EventFormFields({
  event,
  onUpdate,
  errors,
  onLocationChange,
  onSuggestionClick,
  locationSuggestions,
  children,
}) {
  const basicFields = [
    { label: "Title", key: "title", type: "text" },
  ];

  const dateFields = [
    { label: "Start Date", key: "startDate", type: "date" },
    { label: "Start Time", key: "startTime", type: "time" },
    { label: "End Date", key: "endDate", type: "date" },
    { label: "End Time", key: "endTime", type: "time" },
  ];

  return (
    <>
      <div className="flex flex-wrap -mx-2">
        {basicFields.map(({ label, key, type }) => (
          <div key={key} className="mb-4 px-2 w-full sm:w-1/2">
            <label
              htmlFor={`input-${key}`}
              className="block text-sm font-medium"
            >
              {label} <span className="text-red-500">*</span>:
            </label>
            <div className="mt-1">
              <input
                type={type}
                value={event[key]}
                onChange={(e) => onUpdate(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                className="shadow-sm block w-full sm:text-sm rounded-md"
              />
              {errors[key] && (
                <div className="text-red-500 text-sm">{errors[key]}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap -mx-2">
        {dateFields.map(({ label, key, type }) => (
          <div key={key} className="mb-4 px-2 w-full sm:w-1/2">
            <label
              htmlFor={`input-${key}`}
              className="block text-sm font-medium"
            >
              {label} <span className="text-red-500">*</span>:
            </label>
            <div className="mt-1">
              <input
                type={type}
                value={event[key]}
                onChange={(e) => onUpdate(e.target.value, key)}
                name={`input-${key}`}
                id={`input-${key}`}
                className="shadow-sm block w-full sm:text-sm rounded-md"
              />
              {errors[key] && (
                <div className="text-red-500 text-sm">{errors[key]}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label
          htmlFor="input-description"
          className="block text-sm font-medium"
        >
          Description:
        </label>
        <div className="mt-1">
          <textarea
            id="input-description"
            className="textarea textarea-bordered textarea-sm w-full"
            value={event.description}
            onChange={(e) => onUpdate(e.target.value, "description")}
          ></textarea>
          {errors.description && (
            <div className="text-red-500 text-sm">{errors.description}</div>
          )}
        </div>
      </div>

      <div className="mb-4 px-2 w-full relative">
        <label htmlFor="input-location" className="block text-sm font-medium">
          Location <span className="text-red-500">*</span>:
        </label>
        <div className="mt-1">
          <input
            type="text"
            value={event.location}
            onChange={onLocationChange}
            name="input-location"
            id="input-location"
            className="shadow-sm block w-full sm:text-sm rounded-md"
          />
          {errors.location && (
            <div className="text-red-500 text-sm">{errors.location}</div>
          )}
          {locationSuggestions.length > 0 && (
            <ul className="border border-gray-300 rounded mt-1 max-h-40 w-full overflow-y-auto absolute z-50 backdrop-blur-lg bg-white/10 text-black">
              {locationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:glass cursor-pointer"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {children}
    </>
  );
}

EventFormFields.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onLocationChange: PropTypes.func.isRequired,
  onSuggestionClick: PropTypes.func.isRequired,
  locationSuggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
};
