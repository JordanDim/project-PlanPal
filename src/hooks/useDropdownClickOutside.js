import { useEffect } from "react";

export const useDropdownClickOutside = (refs) => {
  useEffect(() => {
    function handleClickOutside(event) {
      refs.forEach((ref) => {
        if (ref.current && !ref.current.contains(event.target)) {
          if (ref.current.hasAttribute("open")) {
            ref.current.removeAttribute("open");
          }
    
        }
      });
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [refs]);
};
