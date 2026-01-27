import { useState } from "react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const useLocationAutocomplete = () => {
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = async (value, onUpdate) => {
    onUpdate(value);
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        setSuggestions(data.features.map((feature) => feature.place_name));
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, onUpdate) => {
    onUpdate(suggestion);
    setSuggestions([]);
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    handleLocationChange,
    handleSuggestionClick,
    clearSuggestions,
  };
};
