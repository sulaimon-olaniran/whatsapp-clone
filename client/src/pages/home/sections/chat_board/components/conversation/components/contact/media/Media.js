import {useDispatch} from "react-redux";

import {OPEN_MESSAGES_MEDIAS_DIALOG} from "../../../../../../../../../store/types/app";

const ContactMediaComponent = ({media}) => {
  const dispatch = useDispatch();

  const handleOpenMessagesMediaDialog = () => {
    dispatch({
      type: OPEN_MESSAGES_MEDIAS_DIALOG,
      payload: {open: true, media: media},
    });
  };
  return (
    <div
      className="contact-media-component-container"
      onClick={handleOpenMessagesMediaDialog}
    >
      {media.type === "image" ? (
        <div
          className="main-media-component-container"
          style={{backgroundImage: `url(${media.image})`}}
        />
      ) : (
        <div
          className="main-media-component-container"
          style={{backgroundImage: `url(${media.gif})`}}
        />
      )}
    </div>
  );
};

export default ContactMediaComponent;
