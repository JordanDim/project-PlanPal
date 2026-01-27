import PropTypes from "prop-types";

export default function LocationInput({
  location,
  onUpdate,
  suggestions,
  onSuggestionClick,
  error,
}) {
  return (
    <div className="mb-4 px-2 w-full sm:w-1/2 relative">
      <label htmlFor="input-location" className="block text-sm font-medium">
        Location <span className="text-red-500">*</span>:
      </label>
      <div className="mt-1">
        <input
          type="text"
          value={location}
          onChange={(e) => onUpdate(e.target.value)}
          name="input-location"
          id="input-location"
          className="shadow-sm block w-full sm:text-sm rounded-md"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="border border-gray-300 rounded mt-1 max-h-40 w-full overflow-y-auto absolute z-50 backdrop-blur-lg bg-white/10 text-black">
            {suggestions.map((suggestion, index) => (
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
  );
}

LocationInput.propTypes = {
  location: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuggestionClick: PropTypes.func.isRequired,
  error: PropTypes.string,
};
