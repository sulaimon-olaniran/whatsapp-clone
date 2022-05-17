import emojiTree from "emoji-tree";
import {Fragment} from "react";

const TextEmojiComponent = ({text}) => {
  let textChuck = "";
  let formattedText = [];

  const brokenString = [...text];

  brokenString.forEach((char, index) => {
    if (emojiTree(char)[0].type === "emoji") {
      if (textChuck !== "") {
        formattedText.push(<Fragment key={index - 1}>{textChuck}</Fragment>);
        textChuck = "";
      }
      formattedText.push(
        <span key={index} className="emoji-text" role="img" aria-hidden="true">
          {char}
        </span>
      );
    } else {
      textChuck += char;
    }
    if (brokenString.length - 1 === index && textChuck !== "") {
      formattedText.push(<Fragment key={index}>{textChuck}</Fragment>);
      textChuck = "";
    }
  });

  return [...formattedText];
};

export default TextEmojiComponent;
