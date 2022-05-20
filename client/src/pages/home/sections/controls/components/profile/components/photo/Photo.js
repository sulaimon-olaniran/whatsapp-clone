import {useState, useRef, Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Avatar, Button} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Popover from "@mui/material/Popover";
import Grow from "@mui/material/Grow";

import UploadProfilePhotoDialog from "./upload/Upload";

import {viewProfilePhoto} from "../../../../../../../../store/actions/app";
import {updateUserData} from "../../../../../../../../store/actions/user";
import CaptureProfilePhotoDialog from "./capture/Capture";

const ProfilePhotoComponent = () => {
  const [photoAnchor, setPhotoAnchor] = useState(null);
  const [inputFile, setInputFile] = useState("");
  const [photoUploadDialog, setPhotoUploadDialog] = useState(false);
  const [photoCaptureDialog, setPhotoCaptureDialog] = useState(false);

  const inputFileRef = useRef(null);

  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  const handleInputFileChange = event => {
    setInputFile(URL.createObjectURL(event.target.files[0]));
    setPhotoUploadDialog(true);
    setPhotoAnchor(null);
  };

  const handleClosePhotoUploadDialog = () => {
    setPhotoUploadDialog(false);
    setPhotoCaptureDialog(false);
  };

  const handleOpenPhotoCaptureDialog = () => {
    setPhotoCaptureDialog(true);
  };

  const handleClosePhotoCaptureDialog = () => {
    setPhotoCaptureDialog(false);
  };

  const handleCropCapturedPhoto = imgSrc => {
    setInputFile(imgSrc);
    setPhotoUploadDialog(true);
  };

  const handleShowPhotoOptions = event => {
    setPhotoAnchor(event.currentTarget);
  };

  const handleHidePhotoOptions = () => {
    setPhotoAnchor(null);
  };

  const handleViewProfilePhoto = () => {
    const payload = {
      name: user.username,
      url: user.profile_photo,
    };

    dispatch(viewProfilePhoto(payload));
    handleHidePhotoOptions();
  };

  const handleOpenSelectImageFile = () => {
    inputFileRef.current.click();
  };

  const handleRemovePhoto = () => {
    const data = {
      type: "photo",
      update: {
        profile_photo: "",
      },
    };

    dispatch(updateUserData(data, handleHidePhotoOptions));
  };

  const handleUpdatePhoto = image => {
    const data = {
      type: "photo",
      update: {
        profile_photo: image,
      },
    };

    dispatch(updateUserData(data, null));
  };

  const photoOptions = [
    {
      option: "View photo",
      action: handleViewProfilePhoto,
    },
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
    <Fragment>
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
      <Grow
        in={true}
        style={{transformOrigin: "0 0 0"}}
        {...(true ? {timeout: 800} : {})}
      >
        <div className="profile-component-avatar-container">
          <input
            type="file"
            name="file_input"
            id="file_input"
            accept="image/png, .jpeg, .jpg"
            ref={inputFileRef}
            onChange={handleInputFileChange}
          />

          <Avatar
            src={user?.profile_photo}
            style={{width: "200px", height: "200px"}}
          />

          {/* {updating.type !== "photo" && ( */}
          <div
            className={`avatar-container-action-button ${
              Boolean(photoAnchor) ? "show-button" : ""
            }`}
            onClick={handleShowPhotoOptions}
          >
            <PhotoCameraIcon />
            <p>
              Change
              <br />
              profile
              <br />
              photo
            </p>
          </div>

          <Popover
            open={Boolean(photoAnchor)}
            anchorEl={photoAnchor}
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
      </Grow>
    </Fragment>
  );
};

export default ProfilePhotoComponent;
