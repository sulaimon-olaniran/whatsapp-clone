import {useState, useRef} from "react";
import {Avatar, IconButton, Button} from "@mui/material";
import {useSelector} from "react-redux";
import ControlHeaderComponent from "../../../../../../../components/headers/ControlsHeader";
import GroupIcon from "@mui/icons-material/Group";
import Zoom from "@mui/material/Zoom";
import CheckIcon from "@mui/icons-material/Check";
import Popover from "@mui/material/Popover";

import {CameraIcon} from "../../../../../../../icons";
import InputEmojisComponent from "../../../../../../../components/emoji/input/Input";
import UploadProfilePhotoDialog from "../../profile/components/photo/upload/Upload";
import CaptureProfilePhotoDialog from "../../profile/components/photo/capture/Capture";

const CompleteNewGroupComponent = ({goBack}) => {
  const [groupIcon, setGroupIcon] = useState(null);
  const [groupSubject, setGroupSubject] = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [inputFile, setInputFile] = useState("");
  const [photoUploadDialog, setPhotoUploadDialog] = useState(false);
  const [photoCaptureDialog, setPhotoCaptureDialog] = useState(false);
  const [optionsAnchor, setOptionsAnchor] = useState(null);

  const inputRef = useRef(null);
  const inputFileRef = useRef(null);

  const theme = useSelector(state => state.app.theme);

  const handleOnInputFocus = () => {
    setInputFocus(true);
  };

  const handleSetInputFocused = () => {
    inputRef.current.focus();
  };

  const handleOnInputBlur = () => {
    setInputFocus(false);
  };

  const handleOnInputChange = event => {
    setGroupSubject(event.target.value);
  };

  const handleOpenSelectImageFile = () => {
    inputFileRef.current.click();
    setOptionsAnchor(null);
  };

  const handleShowPhotoOptions = event => {
    setOptionsAnchor(event.currentTarget);
  };

  const handleHidePhotoOptions = () => {
    setOptionsAnchor(null);
  };

  const handleInputFileChange = event => {
    setInputFile(URL.createObjectURL(event.target.files[0]));
    setPhotoUploadDialog(true);
    //setPhotoAnchor(null);
  };

  const handleClosePhotoUploadDialog = () => {
    setPhotoUploadDialog(false);
    setPhotoCaptureDialog(false);
  };

  const handleOpenPhotoCaptureDialog = () => {
    setPhotoCaptureDialog(true);
    setOptionsAnchor(null);
  };

  const handleClosePhotoCaptureDialog = () => {
    setPhotoCaptureDialog(false);
  };

  const handleCropCapturedPhoto = imgSrc => {
    setInputFile(imgSrc);
    setPhotoUploadDialog(true);
  };

  const handleUpdatePhoto = image => {
    setGroupIcon(image);
  };

  const handleRemovePhoto = () => {
    setGroupIcon(null);
    //setOptionsAnchor(null)
  };

  const photoOptions = [
    {
      option: "Take photo",
      action: handleOpenPhotoCaptureDialog,
    },
    {
      option: "Upload photo",
      action: handleOpenSelectImageFile,
    },
    {
      option: "Remove  photo",
      action: handleRemovePhoto,
    },
  ];

  return (
    <div className={`complete-new-group-component-${theme}-theme`}>
      {photoUploadDialog && (
        <UploadProfilePhotoDialog
          open={photoUploadDialog}
          imageSource={inputFile}
          handleClose={handleClosePhotoUploadDialog}
          handleUpload={handleUpdatePhoto}
        />
      )}

      {photoCaptureDialog && (
        <CaptureProfilePhotoDialog
          open={photoCaptureDialog}
          handleClose={handleClosePhotoCaptureDialog}
          handleCropPhoto={handleCropCapturedPhoto}
        />
      )}

      <ControlHeaderComponent action={goBack} title="New group" />

      <div className="complete-new-group-component-body">
        <div className="new-group-icon-container">
          {!groupIcon ? (
            <div className="add-group-icon-button-container">
              <input
                type="file"
                name="file_input"
                id="file_input"
                accept="image/png, .jpeg, .jpg"
                ref={inputFileRef}
                onChange={handleInputFileChange}
              />
              <GroupIcon />
              <div
                className="add-group-icon-button-inner-container"
                onClick={handleShowPhotoOptions}
              >
                <CameraIcon />
                <p>
                  Add group <br />
                  Icon
                </p>
              </div>
            </div>
          ) : (
            <div className="add-group-icon-avatar-container">
              <input
                type="file"
                name="file_input"
                id="file_input"
                accept="image/png, .jpeg, .jpg"
                ref={inputFileRef}
                onChange={handleInputFileChange}
              />
              <Avatar src={groupIcon} />
              <div
                className="add-group-icon-button-inner-container"
                onClick={handleShowPhotoOptions}
              >
                <CameraIcon />
                <p>
                  Change
                  <br />
                  Group Icon
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="new-group-subject-input-container">
          <div
            className={`input-container ${
              (inputFocus || groupSubject !== "") && "input-focused"
            }`}
          >
            <input
              ref={inputRef}
              onFocus={handleOnInputFocus}
              onBlur={handleOnInputBlur}
              onChange={handleOnInputChange}
              value={groupSubject}
            />
            <span onClick={handleSetInputFocused}>Group subject</span>
          </div>
          <p>{25 - groupSubject.length}</p>
          <InputEmojisComponent setState={setGroupSubject} />
        </div>
      </div>

      <Zoom in={groupSubject !== ""}>
        <div className="complete-new-group-component-footer">
          <IconButton>
            <CheckIcon />
          </IconButton>
        </div>
      </Zoom>

      <Popover
        open={Boolean(optionsAnchor)}
        anchorEl={optionsAnchor}
        onClose={handleHidePhotoOptions}
        anchorOrigin={{
          vertical: 150,
          horizontal: 150,
        }}
      >
        <div className="photo-popper-options-container">
          {photoOptions.map(option => {
            return (
              <Button key={option.option} onClick={option.action}>
                <p>{option.option}</p>
              </Button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

export default CompleteNewGroupComponent;
