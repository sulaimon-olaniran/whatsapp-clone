import {
  useCallback,
  useMemo,
  useState,
  useRef,
  createRef,
  useEffect,
} from "react";
import {useSelector} from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import {IconButton} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

const CaptureProfilePhotoDialog = ({open, handleClose, handleCropPhoto}) => {
  const [streaming, setStreaming] = useState(false);

  const theme = useSelector(state => state.app.theme);

  const playerRef = createRef();
  const canvasRef = createRef();
  const tracks = useRef();

  const userMediaConfig = useMemo(() => ({video: true}), []);

  const handleOnCapture = useCallback(
    imageData => {
      // read as webP
      //setImgSrc(imageData.webP);
      // read as file
      //setImgFile(imageData.file);
      //console.log(URL.createObjectURL(imageData.file));
      handleCropPhoto(imageData.webP);
    },
    [handleCropPhoto]
  );

  const onError = useCallback(error => {
    console.log(error);
  }, []);

  useEffect(() => {
    let timeout;
    navigator.mediaDevices
      .getUserMedia(userMediaConfig)
      .then(stream => {
        playerRef.current.srcObject = stream;
        tracks.current = stream.getTracks();
        timeout = setTimeout(() => setStreaming(true), 2000);
      })
      .catch(error => {
        if (onError) onError(error);
      });
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [onError, userMediaConfig, playerRef]);

  useEffect(() => {
    return () => {
      // Stop the camera stream
      if (tracks.current) {
        tracks.current[0].stop();
      }
    };
  }, []);

  const handleCloseCapture = () => {
    if (tracks.current) {
      tracks.current[0].stop();
    }
    handleClose();
  };

  const captureImage = useCallback(() => {
    const imageWidth = playerRef.current.offsetWidth;
    const imageHeight = playerRef.current.offsetHeight;
    [canvasRef.current.width, canvasRef.current.height] = [
      imageWidth,
      imageHeight,
    ];
    const context = canvasRef.current.getContext("2d");
    context.drawImage(playerRef.current, 0, 0, imageWidth, imageHeight);
    // Trigger the callback function
    if (handleOnCapture) {
      const webPData = canvasRef.current.toDataURL("image/webp");
      canvasRef.current.toBlob(blob => {
        handleOnCapture({
          blob,
          webP: webPData,
          file: new File([webPData], `${new Date().getTime()}.png`),
        });
      });
    }
  }, [handleOnCapture, canvasRef, playerRef]);

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <div className={`capture-profile-photo-dialog-${theme}-theme`}>
        <div className="capture-profile-photo-dialog-header">
          <h2>Take a photo</h2>
          <IconButton onClick={handleCloseCapture}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="capture-profile-photo-dialog-body">
          <video ref={playerRef} autoPlay />
        </div>

        {streaming && (
          <div className="capture-profile-photo-dialog-footer">
            <IconButton onClick={captureImage}>
              <CameraAltOutlinedIcon />
            </IconButton>
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default CaptureProfilePhotoDialog;
