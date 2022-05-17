import {useSelector} from "react-redux";
import moment from "moment";

import {MessageDeletedIcon} from "../../../../icons";

const DeletedMessageComponent = ({message}) => {
  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const {sender} = message;
  return (
    <div className={`deleted-message-component-${theme}-theme `}>
      <div className="deleted-message-body-container">
        <MessageDeletedIcon />
        <span>
          {sender === user._id
            ? "You deleted this message"
            : "This message was deleted"}
          <span className="space" />
        </span>
      </div>

      <div className="message-time-container">
        <p>{moment(message.time).format("LT")}</p>
      </div>
    </div>
  );
};

export default DeletedMessageComponent;
