import {Fragment, useState, useRef} from "react";
import {IconButton} from "@mui/material";
import Popover from "@mui/material/Popover";
import Zoom from "@mui/material/Zoom";
import {styled} from "@mui/material/styles";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";

import {
  InsertIcon,
  InsertCameraIcon,
  InsertContactIcon,
  InsertDocumentIcon,
  InsertImageIcon,
  InsertStickerIcon,
} from "../../../../../../../../../../icons";
import InsertContactsComponent from "./components/contacts/Contacts";

const BootstrapTooltip = styled(({className, ...props}) => (
  <Tooltip {...props} classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    height: "30px",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContents: "center",
    fontSize: "13px",
    borderRadius: "15px",
    padding: "15px",
  },
}));

const MessageInputInsertPopoverComponent = ({
  showInsertOption,
  setInsertedMedias,
  setInsertedDocs,
  setInsertedSticker,
  replyMessage,
  setReplyMessage,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [contactsPop, setContactsPop] = useState(false);

  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const stickerInputRef = useRef(null);

  const handleOpenContactsPopover = () => {
    setContactsPop(true);
    setAnchorEl(null);
  };

  const handleCloseContactsPopover = () => {
    setContactsPop(false);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenSelectFiles = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async event => {
    const selectedFiles = Array.from(event.target.files);

    const base64Files = [];

    Promise.all(
      selectedFiles.map(async file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          base64Files.push(reader.result);
        };
      })
    );

    setTimeout(() => {
      setInsertedMedias(base64Files);
      showInsertOption("photos & videos");
      handleClose();
    }, 10);

    //handleSetFiles(base64Files)
  };

  const handleOpenSelectDocs = () => {
    docInputRef.current.click();
  };

  const handleDocInputChange = event => {
    const selectedDocs = Array.from(event.target.files);

    setInsertedDocs(selectedDocs);
    showInsertOption("document");
    handleClose();
  };

  const handleOpenSelectSticker = () => {
    stickerInputRef.current.click();
  };

  const handleStickerInputChange = event => {
    // const selectedStickers = Array.from(event.target.files);

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setInsertedSticker(reader.result);
      showInsertOption("sticker");
      handleClose();
    };
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const options = [
    {
      title: "Contact",
      icon: <InsertContactIcon />,
      action: () => {
        handleOpenContactsPopover();
        handleClose();
      },
      zoom: 500,
    },

    {
      title: "Document",
      icon: <InsertDocumentIcon />,
      action: () => handleOpenSelectDocs(),
      zoom: 400,
    },

    {
      title: "Camera",
      icon: <InsertCameraIcon />,
      action: () => {
        showInsertOption("camera");
        handleClose();
      },
      zoom: 300,
    },

    {
      title: "Sticker",
      icon: <InsertStickerIcon />,
      action: () => handleOpenSelectSticker(),
      zoom: 200,
    },

    {
      title: "Photos & Videos",
      icon: <InsertImageIcon />,
      action: () => handleOpenSelectFiles(),
      zoom: 100,
    },
  ];

  return (
    <Fragment>
      <InsertContactsComponent
        open={contactsPop}
        handleClose={handleCloseContactsPopover}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
      <IconButton onClick={handleClick}>
        <InsertIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        elevation={0}
      >
        <div className="message-input-insert-popover-component">
          <input
            type="file"
            name="insert_media_input"
            id="insert_media_input"
            accept="image/png, .jpeg, .jpg"
            ref={fileInputRef}
            multiple
            onChange={handleFileInputChange}
          />

          <input
            type="file"
            name="insert_doc_input"
            id="insert_doc_input"
            accept=".doc, .pdf"
            ref={docInputRef}
            multiple
            onChange={handleDocInputChange}
          />

          <input
            type="file"
            name="insert_sticker_input"
            id="insert_sticker_input"
            accept="image/png, .jpeg, .jpg"
            ref={stickerInputRef}
            onChange={handleStickerInputChange}
          />

          {options.map(option => {
            return (
              <Zoom in={true} timeout={option.zoom} key={option.title}>
                <div>
                  <BootstrapTooltip title={option.title} placement="right">
                    <IconButton onClick={option.action}>
                      {option.icon}
                    </IconButton>
                  </BootstrapTooltip>
                </div>
              </Zoom>
            );
          })}
        </div>
      </Popover>
    </Fragment>
  );
};

export default MessageInputInsertPopoverComponent;
