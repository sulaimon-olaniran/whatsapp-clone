import {Fragment, useState} from "react";
import {useDispatch} from "react-redux";
import {useDrag, DragPreviewImage} from "react-dnd";
import Draggable from "react-draggable";
import MediasDialogComponent from "../../../../../../../../../components/medias_dialog/MediasDialog";

import {ItemTypes} from "../../../../ItemTypes";
import {OPEN_MESSAGES_MEDIAS_DIALOG} from "../../../../../../../../../store/types/app";

const ContactMediaComponent = ({media}) => {
  // const [openMedidaDialog, setOpenMedialog] = useState(false);
  // const [isDragging, setIsDragging] = useState(false);
  // const [dragPosition, setDragPostion] = useState({
  //   x: 0,
  //   y: 0,
  // });

  // const handleOnDragStart = () => {
  //   console.log("drag started");
  // };

  // const handleOnDragging = () => {
  //   setIsDragging(true);
  // };

  // const handleOnDragStop = (one, two) => {
  //   // console.log(one);
  //   // console.log(two);
  //   setIsDragging(false);
  //   setDragPostion(prev => ({
  //     x: 0,
  //     y: 0,
  //   }));
  // };

  // const [, drag] = useDrag(() => ({type: media}));
  const dispatch = useDispatch();

  const handleOpenMessagesMediaDialog = () => {
    const data = dispatch({
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
