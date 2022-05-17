import {useState} from "react";
import {Avatar, Checkbox} from "@mui/material";

const label = {inputProps: {"aria-label": "Checkbox demo"}};

const InsertContactsEachContact = ({
  contact,
  selectedContacts,
  setSelectedContacts,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const addContactToSelected = () => {
    if (selectedContacts.length - 5 === 0) return;

    setIsChecked(true);
    setSelectedContacts(prev => [...prev, contact]);
  };

  const removeContactFromSelected = () => {
    setIsChecked(false);
    setSelectedContacts(prev => prev.filter(item => item !== contact));
  };

  return (
    <div
      className="insert-contacts-each-contact-container"
      onClick={
        selectedContacts?.includes(contact)
          ? removeContactFromSelected
          : addContactToSelected
      }
    >
      <div className="checkbox-container">
        <Checkbox {...label} color="default" checked={isChecked} />
      </div>

      <div className="contact-inforamtion-container">
        <Avatar src={contact.profile_photo} />
        <div className="contact-name-about-information-container">
          <p>{contact.username}</p>
          <small>{contact.about}</small>
        </div>
      </div>
    </div>
  );
};

export default InsertContactsEachContact;
