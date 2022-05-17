import {useSelector} from "react-redux";

import StarredMessagesComponent from "../../../../../../../../../../components/starred_messages/StarredMessages";

const ConversationStarredMessages = ({deactiveControl}) => {
  const currentChat = useSelector(state => state.chat.currentChat);
  const starredMessages = useSelector(state => state.chat.starredMessages);

  const chatStarredMessages = starredMessages.filter(message => {
    return message.chatId === currentChat._id;
  });

  return (
    <div className="conversation-starred-messages-component">
      <StarredMessagesComponent
        goBack={deactiveControl}
        messages={chatStarredMessages}
      />
    </div>
  );
};

export default ConversationStarredMessages;
