import {useSelector} from "react-redux";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ControlHeaderComponent from "../../../headers/ControlsHeader";

const MessageInfoComponent = () => {
  const theme = useSelector(state => state.app.theme);
  return (
    <div className={`message-info-component-${theme}-theme`}>
      <header>
        <IconButton>
          <CloseIcon />
        </IconButton>
        <p>Contact info</p>
      </header>
      <div></div>
    </div>
  );
};

export default MessageInfoComponent;
