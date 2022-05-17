import {useState} from "react";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {IconButton} from "@mui/material";
import {useSelector} from "react-redux";

import {
  StarIcon,
  DeleteIcon,
  ForwardIcon,
} from "../../../../../../../../../../icons";
import ForwardMessageComponent from "../../../../../../../../../../components/forward_message/ForwardMessage";

const SelectedMessageInputActionsComponent = ({
  selectedMessages,
  setSelectedMessages,
}) => {
  const [forwardMessageDialog, setForwardMessageDialog] = useState(false);
  const theme = useSelector(state => state.app.theme);

  const handleOpenForwardMessageDialog = () => {
    setForwardMessageDialog(true);
  };

  const handleCloseForwardMessageDialog = () => {
    setForwardMessageDialog(false);
  };

  return (
    <div
      className={`selected-message-input-actions-component-${theme}-theme ${
        selectedMessages.length > 0 && "selected-message-input-active"
      }`}
    >
      <ForwardMessageComponent
        open={forwardMessageDialog}
        handleClose={handleCloseForwardMessageDialog}
        messages={selectedMessages}
        closeSelectedMessages={() => setSelectedMessages([])}
      />
      <section className="select-message-input-actions-left-section">
        <IconButton onClick={() => setSelectedMessages([])}>
          <CloseOutlined />
        </IconButton>
        <p>{selectedMessages.length} selected</p>
      </section>

      <section className="select-message-input-actions-right-section">
        <IconButton>
          <StarIcon />
        </IconButton>

        <IconButton>
          <DeleteIcon />
        </IconButton>

        <IconButton onClick={handleOpenForwardMessageDialog}>
          <ForwardIcon />
        </IconButton>
      </section>
    </div>
  );
};

export default SelectedMessageInputActionsComponent;
