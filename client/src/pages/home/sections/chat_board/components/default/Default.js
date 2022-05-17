import {useSelector} from "react-redux";

import {
  ChatBoardIcon,
  LaptopIcon,
  PadlockIcon,
  LightThemeChatBoardIcon,
} from "../../../../../../icons";

//#F1F1F2

const ChatBoardDefault = () => {
  const theme = useSelector(state => state.app.theme);

  return (
    <div className={`chat-board-default-${theme}-theme`}>
      <div className="app-information-container">
        <ChatBoardIcon
          firstFill={theme === "light" ? "#DAF7F3" : "#364147"}
          secondFill={theme === "light" ? "#fff" : "#F1F1F2"}
          opacity={theme === "light" ? "1" : ".38"}
        />

        <div className="heading-text-container">
          <h1>O-S Whatsapp Web Clone</h1> <p>NEW</p>
        </div>

        <div className="first-information-container">
          <p>
            Now send and receive messages without keeping your phone online.
          </p>

          <p>
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>

        <div className="second-information-container">
          <LaptopIcon />
          <p>
            Make calls from desktop with Whatsapp for Mac.{" "}
            <span>Get it here.</span>
          </p>
        </div>
      </div>

      <div className="default-footer-container">
        <PadlockIcon /> <p>End-to-end encrypted</p>
      </div>
    </div>
  );
};

export default ChatBoardDefault;
