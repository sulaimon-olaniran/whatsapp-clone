import {useSelector} from "react-redux";

import {
  ReplyMessageContactIcon,
  SmallContactIcon,
} from "../../../../../../icons";

const ReplyContactType = ({message, from}) => {
  const {sender, contacts} = message;

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  //const currentChat = useSelector(state => state.chat.currentChat);

  return (
    <div
      className={`reply-contact-type-container-${theme}-theme ${
        sender === user?._id && `reply-contact-type-message-sent-${theme}`
      } ${from && "reply-contact-from-input"}`}
    >
      <div className="reply-contact-type-details-container">
        <div className="reply-contact-type-sender-container">
          <p>{sender === user?._id ? "You" : "Michael Sabitzer"}</p>
        </div>

        <div className="reply-contact-type-caption-container">
          <div className="reply-contact-type-caption-text">
            <div className="caption-icon">
              <SmallContactIcon />
            </div>

            <span>
              {contacts.length} contact{contacts.length > 1 && "s"}
            </span>
          </div>
        </div>
      </div>

      <div className="reply-contact-type-contact-container">
        <ReplyMessageContactIcon />
      </div>
    </div>
  );
};

export default ReplyContactType;
