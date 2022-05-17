import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

import HomepageControlsSection from "./sections/controls/Controls";
import ChatBoard from "./sections/chat_board/ChatBoard";

const Homepage = () => {
  const token = useSelector(state => state.user.token);
  const theme = useSelector(state => state.app.theme);

  if (!token) return <Navigate to="/signin" />;
  return (
    <div className={`homepage-${theme}-theme-container`}>
      <div className="homepage-inner-contents-container">
        <div className="homepage-controls-container">
          <HomepageControlsSection />
        </div>

        <div className="homepage-chat-board-container">
          <ChatBoard />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
