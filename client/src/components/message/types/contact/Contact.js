import {useState} from "react";
import {Avatar, Button} from "@mui/material";
import {Fragment} from "react";
import {useSelector} from "react-redux";
import moment from "moment";

import MessageStatusComponent from "../../components/status/Status";
import SharedContactInfoComponent from "./info/Info";
import {SmallStarIcon} from "../../../../icons";

const MessageContactType = ({message}) => {
  const [showInfo, setShowInfo] = useState(false);
  const {sender, contacts} = message;

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

  const handleOpenContactInfoDialog = () => {
    setShowInfo(true);
  };

  const handleCloseContactInfoDialog = () => {
    setShowInfo(false);
  };

  return (
    <div className={`message-contact-type-${theme}-theme`}>
      <SharedContactInfoComponent
        open={showInfo}
        handleClose={handleCloseContactInfoDialog}
        contacts={contacts}
      />

      <div className="message-contact-type-body-container">
        <div className="message-contact-type-contact-info-container">
          <div className="contact-type-contact-avatar-container">
            {contacts.length > 1 ? (
              <div className="contact-avatar-multiple-container">
                {contacts.slice(0, 3).map(contact => {
                  return (
                    <div
                      key={contact._id}
                      className="each-contact-avatar-container"
                      onClick={handleOpenContactInfoDialog}
                    >
                      <Avatar src={contact.profile_photo} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <Avatar
                  src={contacts[0].profile_photo}
                  onClick={handleOpenContactInfoDialog}
                />
              </>
            )}
          </div>
          <div className="contact-type-contact-name-container">
            <p key={contacts[0].username}>
              {contacts[0].username}
              {contacts.length > 1 &&
                ` and ${contacts.length - 1} other contacts`}
            </p>
          </div>
        </div>

        <div className="message-contact-type-time-container">
          <div className="message-time-container">
            {message?.starred?.includes(user._id) && <SmallStarIcon />}
            <p>{moment(message.time).format("LT")}</p>
            <MessageStatusComponent message={message} />
          </div>
        </div>
      </div>

      <div className="message-contact-type-button-container">
        {contacts.length < 2 ? (
          <Fragment>
            <Button>Message</Button>
            <Button>Add to a Group</Button>
          </Fragment>
        ) : (
          <Button onClick={handleOpenContactInfoDialog}>View all</Button>
        )}
      </div>
    </div>
  );
};

export default MessageContactType;
