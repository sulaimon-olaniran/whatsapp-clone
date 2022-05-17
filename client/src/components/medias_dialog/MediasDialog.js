import {forwardRef, useState, useRef, useEffect, Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import moment from "moment";

import {ForwardIcon, StarIcon, DownloadIcon} from "../../icons";
import MediasDialogEachMedia from "./EachMedia";
import {CLOSE_MESSAGES_MEDIAS_DIALOG} from "../../store/types/app";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const MessagesMediasDialogComponent = () => {
  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat?.currentChat);
  const messagesMediaDialog = useSelector(
    state => state.app.messagesMediaDialog
  );

  const messages = currentChat?.messages;

  //console.log(messagesMediaDialog);

  const {open, media} = messagesMediaDialog;

  const [selectedMedia, setSelectedMedia] = useState(null);

  const medias = messages?.filter(
    message => message.type === "image" || message.type === "gif"
  );

  const handleSetSelectedMedia = (data, index) => {
    setSelectedMedia(data);
    containerRef.current.children[index].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const handleCloseDialog = () => {
    dispatch({
      type: CLOSE_MESSAGES_MEDIAS_DIALOG,
    });
  };

  useEffect(() => {
    setSelectedMedia(media);
  }, [media]);

  const mediaTime = moment(selectedMedia?.time);
  const currentDay = moment(new Date());
  const prevDay = moment().subtract(1, "day");
  const weekDifference = currentDay
    .startOf("day")
    .diff(mediaTime.startOf("day"), "weeks");
  const isCurrentDay = mediaTime.isSame(currentDay, "day");
  const isPrevDay = mediaTime.isSame(prevDay, "day");

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      //keepMounted={false}
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-slide-description"
      fullScreen
    >
      <div className={`medias-dialog-component-${theme}-theme`}>
        <header className="medias-dialog-header-container">
          <section className="medias-header-left-section">
            <Avatar
              src={
                selectedMedia?.sender === user?._id
                  ? user?.profile_photo
                  : currentChat?.partnerData?.profile_photo
              }
            />
            <div className="media-info-container">
              <p>
                {selectedMedia?.sender === user?._id
                  ? "You"
                  : currentChat?.partnerData?.username}
              </p>
              <Fragment>
                {weekDifference > 0 ? (
                  <span>
                    {moment(selectedMedia?.time).format("L")} at{" "}
                    {moment(selectedMedia?.time).format("LT")}
                  </span>
                ) : (
                  <span>
                    {isCurrentDay
                      ? "Today"
                      : isPrevDay
                      ? "Yesterday"
                      : moment(selectedMedia?.time).format("dddd")}{" "}
                    at {moment(selectedMedia?.time).format("LT")}
                  </span>
                )}
              </Fragment>
            </div>
          </section>
          <section className="medias-header-right-section">
            <IconButton>
              <ChatBubbleOutlineIcon />
            </IconButton>

            <IconButton>
              <StarIcon />
            </IconButton>

            <IconButton>
              <ForwardIcon />
            </IconButton>

            <IconButton>
              <DownloadIcon />
            </IconButton>

            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </section>
        </header>

        <div className="medias-dialog-body-container">
          <div className="medias-dialog-selected-media-container">
            {selectedMedia?.type === "image" ? (
              <img src={selectedMedia?.image} alt="" />
            ) : (
              <img src={selectedMedia?.gif} alt="" />
            )}
          </div>

          {selectedMedia?.caption && (
            <p>
              <span>{selectedMedia?.caption}</span>
            </p>
          )}
        </div>

        <div className="medias-dialog-footer-container" ref={containerRef}>
          {medias?.map((media, index) => {
            return (
              <MediasDialogEachMedia
                key={index}
                media={media}
                handleSelectMedia={handleSetSelectedMedia}
                selectedMedia={selectedMedia}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};

export default MessagesMediasDialogComponent;
