import {useSelector} from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const UniversalLoader = () => {
  const userLoadingAction = useSelector(state => state.user.loading);
  const creatingChat = useSelector(state => state.chat.creatingChat);
  const open = userLoadingAction || creatingChat;
  return (
    <div
      className={`universal-loader-container ${
        open && "show-universal-loader"
      }`}
    >
      <CircularProgress color="success" />
    </div>
  );
};

export default UniversalLoader;
