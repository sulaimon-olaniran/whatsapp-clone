import {IconButton} from "@mui/material";

const EmojiTypesComponent = ({emojis, type, setState}) => {
  const handleAddEmojiToRecent = emoji => {
    //GET RECENT EMOJIS FROM LOCAL STORAGE
    const recentEmojis =
      JSON.parse(localStorage.getItem("recent_emojis")) || [];

    //CHECK IF EMOJI ALREADY EXISTS
    if (recentEmojis.indexOf(emoji) === -1) {
      //REMOVE EMOJI IF IT'S ALREADY IN EXISTENCE
      const filtered = recentEmojis.filter(function (el) {
        return el.description !== emoji.description;
      });
      //REPLACE EMOJI TO APPEAR AS LATEST
      filtered.push(emoji);
      //PUSH NEW ARRAY TO RECENT EMOJIS
      localStorage.setItem("recent_emojis", JSON.stringify(filtered));
    } else {
      //EMOJI DOESN'T EXIST, JUST ADD IT
      recentEmojis.push(emoji);
      localStorage.setItem("recent_emojis", JSON.stringify(recentEmojis));
    }
  };
  const handleSelectEmoji = emoji => {
    setState(prev => prev.concat(emoji.emoji));
    handleAddEmojiToRecent(emoji);
  };

  return (
    <div className="emoji-types-lists-container">
      <p>{type}</p>
      <div className="emoji-types-lists-body-container">
        {emojis.map(emoji => {
          return (
            <IconButton
              key={emoji.description}
              size="small"
              onClick={() => handleSelectEmoji(emoji)}
            >
              {emoji.emoji}
            </IconButton>
          );
        })}
      </div>
    </div>
  );
};

export default EmojiTypesComponent;
