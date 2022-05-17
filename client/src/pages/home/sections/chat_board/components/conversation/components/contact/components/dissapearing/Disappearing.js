import {useSelector} from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import ControlHeaderComponent from "../../../../../../../../../../components/headers/ControlsHeader";
import {DisappearingMessagesIcon} from "../../../../../../../../../../icons";

const ConversationDisappearingdMessages = ({deactiveControl}) => {
  const theme = useSelector(state => state.app.theme);
  return (
    <div className={`conversation-disappearing-messages-${theme}-theme`}>
      <ControlHeaderComponent
        action={deactiveControl}
        title="Disappearing messages"
      />
      <div className="conversation-disappearing-messages-body-container">
        <div className="disappearing-messages-icon-container">
          <DisappearingMessagesIcon />
        </div>

        <div className="disappearing-messages-details-container">
          <h1>Make messages in this chat disappear</h1>
          <p>
            For more privacy and storage, all new messages will disappear from
            this chat for everyone after the selected duration. Anyone in the
            chat can change this setting. <span>Learn more</span>
          </p>
        </div>

        <div className="disappearing-messages-actions-container">
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="off"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="24 hours"
              control={<Radio />}
              label="24 Hours"
            />
            <FormControlLabel
              value="7 days"
              control={<Radio />}
              label="7 Days"
            />
            <FormControlLabel
              value="90 days"
              control={<Radio />}
              label="90 Days"
            />
            <FormControlLabel value="off" control={<Radio />} label="Off" />
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ConversationDisappearingdMessages;
