import {useState} from "react";
import {useSelector} from "react-redux";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import {IconButton} from "@mui/material";
import Popover from "@mui/material/Popover";

import EmojisComponent from "../emojis/Emojis";

const InputEmojisComponent = ({setState}) => {
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  const theme = useSelector(state => state.app.theme);

  const handleShowEmojis = event => {
    setEmojiAnchor(event.currentTarget);
  };

  const handleHideEmojis = () => {
    setEmojiAnchor(null);
  };

  return (
    <>
      <div className="input-emojis-component-container">
        <IconButton size="medium" onClick={handleShowEmojis}>
          <InsertEmoticonOutlinedIcon />
        </IconButton>
      </div>

      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={handleHideEmojis}
        anchorOrigin={{
          vertical: -340,
          horizontal: -10,
        }}
        className="input-emojis-component-popover"
      >
        <div className={`emojis-content-container-${theme}-theme`}>
          <EmojisComponent setState={setState} />
        </div>
      </Popover>
    </>
  );
};

export default InputEmojisComponent;
