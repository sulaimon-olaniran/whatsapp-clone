import {useState, useRef} from "react";
import {useSelector} from "react-redux";
import {IconButton} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import CheckIcon from "@mui/icons-material/Check";

const UploadProfilePhotoDialog = ({
  open,
  handleClose,
  imageSource,
  handleUpload,
}) => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropZoom, setCropZoom] = useState(0);

  const cropperRef = useRef(null);

  const theme = useSelector(state => state.app.theme);

  const handleOnCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const croppedImage = cropper.getCroppedCanvas().toDataURL();
    setCroppedImage(croppedImage);
  };

  const handleCompleteUpload = () => {
    handleUpload(croppedImage);
    handleClose();
  };

  const handleZoomInImage = () => {
    setCropZoom(prev => prev + 0.5);
  };

  const handleZoomOutImage = () => {
    if (cropZoom < 0.1) return;
    setCropZoom(prev => prev - 0.5);
  };

  const handleCloseDialog = () => {
    setCropZoom(0);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      //onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <div className={`upload-profile-photo-dialog-${theme}-theme`}>
        <div className="upload-profile-photo-dialog-header">
          <h2>Crop Your Picture</h2>

          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="upload-profile-photo-dialog-body">
          <div className="zoom-buttons-control-container">
            <IconButton sizw="small" onClick={handleZoomInImage}>
              <AddIcon />
            </IconButton>

            <IconButton size="small" onClick={handleZoomOutImage}>
              <RemoveIcon />
            </IconButton>
          </div>
          <Cropper
            src={imageSource}
            zoomTo={cropZoom}
            className="cropper-component-container"
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            initialAspectRatio={14 / 14}
            cropBoxResizable={false}
            guides={false}
            rotatable={false}
            crop={handleOnCrop}
            ref={cropperRef}
            zoomOnTouch={false}
          />
        </div>

        <div className="upload-profile-photo-dialog-footer">
          <IconButton onClick={handleCompleteUpload}>
            <CheckIcon />
          </IconButton>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadProfilePhotoDialog;
