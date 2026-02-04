import {
  validateTitle,
  validateDescription,
  validateLocation,
  validateStartDate,
  validateEndDate,
  validateStartTime,
  validateEndTime,
} from "../common/helpers/validationHelpers.js";

export const useEventFormValidation = (event) => {
  const validateEventForm = () => {
    const {
      title,
      description,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
    } = event;

    const validationErrors = {
      title: validateTitle(title),
      description: validateDescription(description),
      location: validateLocation(location),
      startDate: validateStartDate(startDate, startTime),
      startTime: validateStartTime(startTime),
      endDate: validateEndDate(endDate, startDate, endTime, startTime),
      endTime: validateEndTime(endTime),
    };

    const filteredErrors = Object.keys(validationErrors).reduce(
      (acc, key) => {
        if (validationErrors[key]) acc[key] = validationErrors[key];
        return acc;
      },
      {}
    );

    return filteredErrors;
  };

  return { validateEventForm };
};
