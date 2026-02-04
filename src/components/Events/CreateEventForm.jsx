import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  addEvent,
  getUserContacts,
  inviteUser,
  getContactLists,
  getContactListById,
} from "../../services/event.service.js";
import { uploadCover } from "../../services/upload.service.js";
import Button from "../Button.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { GoBackArrow } from "../../common/helpers/icons.jsx";
import {
  EVENT_SPORTS_COVER,
  EVENT_ENTERTAINMENT_COVER,
  EVENT_CULTURE_AND_SCIENCE_COVER,
  EVENT_COVER_BY_DEFAULT,
  BASE,
} from "../../common/constants.js";
import Map from "./Map.jsx";
import "./styles.css";
import { errorChecker, themeChecker } from "../../common/helpers/toast.js";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete.js";
import { useEventFormValidation } from "../../hooks/useEventFormValidation.js";
import EventFormFields from "./form/EventFormFields.jsx";
import ReoccurringSelect from "./form/ReoccurringSelect.jsx";
import CategorySelect from "./form/CategorySelect.jsx";

export default function CreateEvent() {
  const [event, setEvent] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    description: "",
    isPublic: true,
    isReoccurring: "never",
    category: "Entertainment",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const { userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inviteRef = useRef(null);
  const inviteListRef = useRef(null);
  const [isReoccurringOpen, setIsReoccurringOpen] = useState(false);
  const [finalDate, setFinalDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const { suggestions, handleLocationChange, handleSuggestionClick } =
    useLocationAutocomplete();

  const { validateEventForm } = useEventFormValidation(event);

  useEffect(() => {
    function handleClickOutside(e) {
      if (inviteRef.current && !inviteRef.current.contains(e.target)) {
        inviteRef.current.removeAttribute("open");
      }
      if (
        inviteListRef.current &&
        !inviteListRef.current.contains(e.target)
      ) {
        inviteListRef.current.removeAttribute("open");
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (userData?.handle) {
        const contactsData = await getUserContacts(userData.handle);
        setContacts(contactsData);
      }
    };

    const fetchContactLists = async () => {
      if (userData?.handle) {
        const listsData = await getContactLists(userData.handle);
        setContactLists(listsData);
      }
    };

    fetchContacts();
    fetchContactLists();
  }, [userData]);

  const updateEvent = (value, key) => {
    setEvent({
      ...event,
      [key]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInviteUser = (userHandle) => {
    setInvitedUsers((prevUsers) => [...prevUsers, userHandle]);
    themeChecker(`${userHandle} was successfully added to the invite list.`);
    if (inviteRef.current) {
      inviteRef.current.removeAttribute("open");
    }
  };

  const handleInviteList = async (listId, listTitle) => {
    const contacts = await getContactListById(listId);
    const newUsers = Object.keys(contacts);
    setInvitedUsers((prevUsers) => [...prevUsers, ...newUsers]);
    themeChecker(`Everybody from ${listTitle} was added to the invite list`);
    if (inviteListRef.current) {
      inviteListRef.current.removeAttribute("open");
    }
  };

  const onLocationChange = (e) => {
    const value = e.target.value;
    handleLocationChange(value, (newValue) => updateEvent(newValue, "location"));
  };

  const onSuggestionClick = (suggestion) => {
    handleSuggestionClick(suggestion, (newValue) =>
      updateEvent(newValue, "location")
    );
  };

  const getDefaultCoverByCategory = (category) => {
    switch (category) {
      case "Sports":
        return EVENT_SPORTS_COVER;
      case "Entertainment":
        return EVENT_ENTERTAINMENT_COVER;
      case "Culture & Science":
        return EVENT_CULTURE_AND_SCIENCE_COVER;
      default:
        return EVENT_COVER_BY_DEFAULT;
    }
  };

  const createEvent = async () => {
    const filteredErrors = validateEventForm();

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    try {
      let coverURL = "";
      if (coverFile) {
        coverURL = await uploadCover(event.title, coverFile);
      } else {
        coverURL = getDefaultCoverByCategory(event.category);
      }

      const newEvent = await addEvent(
        {
          ...event,
          creator: userData.handle,
          cover: coverURL,
        },
        invitedUsers
      );

      for (const userHandle of invitedUsers) {
        await inviteUser(newEvent.id, userData.handle, userHandle);
      }

      const updatedUserData = {
        ...userData,
        goingToEvents: {
          ...userData.goingToEvents,
          [event.title]: true,
        },
      };
      setUserData(updatedUserData);

      setEvent({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        description: "",
        isPublic: false,
        isReoccurring: "never",
        category: "Entertainment",
      });
      setCoverFile(null);
      setInvitedUsers([]);
      navigate(`${BASE}events`);
    } catch (error) {
      console.error("Error creating event:", error);
      errorChecker("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="single-event-container p-8 max-w-5xl mx-auto rounded-[30px] mt-8 mb-8" style={{ boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.2)' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <GoBackArrow onClick={() => navigate(`${BASE}events`)} />
      </div>

      <EventFormFields
        event={event}
        onUpdate={updateEvent}
        errors={errors}
        onLocationChange={onLocationChange}
        onSuggestionClick={onSuggestionClick}
        locationSuggestions={suggestions}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium">Public Event:</label>
          <div className="mt-1">
            <input
              type="checkbox"
              checked={event.isPublic}
              onChange={(e) => updateEvent(e.target.checked, "isPublic")}
              className="h-4 w-4 rounded"
            />
          </div>
        </div>

        <ReoccurringSelect
          value={event.isReoccurring}
          onUpdate={(value) => updateEvent(value, "isReoccurring")}
          isOpen={isReoccurringOpen}
          onToggle={setIsReoccurringOpen}
          finalDate={finalDate}
          isIndefinite={isIndefinite}
          onFinalDateChange={(value) => {
            setFinalDate(value);
            updateEvent(value, "finalDate");
          }}
          onIndefiniteChange={setIsIndefinite}
        />

        <CategorySelect
          value={event.category}
          onUpdate={(value) => updateEvent(value, "category")}
          isOpen={isCategoryOpen}
          onToggle={setIsCategoryOpen}
          includeOther={true}
        />
      </EventFormFields>

      <div>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="w-full h-full object-cover rounded-xl mb-2"
          />
        )}
      </div>
      <div className="flex items-center gap-1.9 my-4">
        <Button className="font-bold py-2 px-4 rounded" onClick={createEvent}>
          Create
        </Button>
        <Button
          onClick={() => document.getElementById("cover-upload").click()}
          className="font-bold py-2 px-4 rounded"
        >
          Upload Cover
        </Button>

        <details
          className="dropdown"
          ref={inviteRef}
          style={{ position: "relative" }}
        >
          <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
            Invite Contact
          </summary>
          <div
            className="dropdown-menu absolute w-48 max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black"
            style={{ zIndex: 999 }}
          >
            <ul className="space-y-2 overflow-x-hidden">
              {contacts.length === 0 ? (
                <li className="p-2">No contacts found.</li>
              ) : (
                contacts.map((contact) => (
                  <li
                    key={contact}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <a onClick={() => handleInviteUser(contact)}>{contact}</a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </details>

        <details className="dropdown" ref={inviteListRef}>
          <summary className="m-1 font-bold py-2 px-4 cursor-pointer btn btn-secondary">
            Invite Group
          </summary>
          <div
            className="dropdown-menu absolute w-48 max-h-48 overflow-y-auto mt-2 backdrop-blur-lg bg-white/10 text-black"
            style={{ zIndex: 999 }}
          >
            <ul className="space-y-2 overflow-x-hidden">
              {contactLists.length === 0 ? (
                <li className="p-2">No contact lists found.</li>
              ) : (
                contactLists.map((list) => (
                  <li
                    key={list.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <a onClick={() => handleInviteList(list.id, list.title)}>
                      {list.title}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </details>
        <input
          type="file"
          id="cover-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="my-4">
        <Map address={event.location} />
      </div>
    </div>
  );
}
