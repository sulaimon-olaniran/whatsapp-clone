import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";
import moment from "moment";

import ContactMediaComponent from "../../../../media/Media";
import {groupArrayByDatesFunction} from "../../../../../../../../../../../../functions";

const MediaComponent = ({containerRef}) => {
  const theme = useSelector(state => state.app.theme);
  const messages = useSelector(state => state.chat.currentChat.messages);

  const medias = messages.filter(
    message => message.type === "image" || message.type === "gif"
  );

  const groupedMedia = groupArrayByDatesFunction(medias, "M");
  return (
    <Slide
      direction="left"
      in={true}
      mountOnEnter
      unmountOnExit
      container={containerRef.current}
    >
      <div className={`media-component-${theme}-theme`}>
        {groupedMedia.length > 0 ? (
          groupedMedia.map((group, index) => {
            return (
              <div className="media-component-each-group" key={index}>
                <h1>{moment(group[0].date).format("MMMM YYYY")}</h1>
                <div className="each-group-medias-body-container">
                  {group.map(media => {
                    return (
                      <div
                        key={media._id}
                        className="each-group-media-body-container"
                      >
                        <ContactMediaComponent media={media} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-medias-container">
            <p>No Medias</p>
          </div>
        )}
      </div>
    </Slide>
  );
};

export default MediaComponent;
