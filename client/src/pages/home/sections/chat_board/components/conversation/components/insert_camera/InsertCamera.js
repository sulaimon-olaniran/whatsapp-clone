import {
  useCallback,
  useMemo,
  useState,
  useRef,
  createRef,
  useEffect,
  Fragment,
} from "react";
import {useSelector} from "react-redux";
import {Button, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import {RetakeIcon} from "../../../../../../../../icons";
import InsertCameraCapturedPhoto from "./photo/Photo";

const ConversationInsertCameraComponent = ({
  closeOption,
  replyMessage,
  setReplyMessage,
}) => {
  const [streaming, setStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const theme = useSelector(state => state.app.theme);

  const playerRef = createRef();
  const canvasRef = createRef();
  const tracks = useRef();

  const userMediaConfig = useMemo(() => ({video: true}), []);

  const handleOnCapture = useCallback(imageData => {
    // read as webP
    //setImgSrc(imageData.webP);
    // read as file
    //setImgFile(imageData.file);
    //console.log(URL.createObjectURL(imageData.file));
    setCapturedPhoto(imageData.webP);
  }, []);

  const onError = useCallback(error => {
    console.log(error);
  }, []);

  const handleCloseOption = () => {
    if (tracks.current) {
      tracks.current[0].stop();
    }
    closeOption();
  };

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
    <div className={`conversation-insert-camera-component-${theme}-theme`}>
      <div className="conversation-insert-camera-header">
        <section className="insert-camera-header-left-section">
          <IconButton onClick={handleCloseOption}>
            <CloseIcon />
          </IconButton>
          <h1>Take photo</h1>
        </section>
        {capturedPhoto && (
          <section className="insert-camera-header-right-section">
            <Button onClick={() => setCapturedPhoto(null)}>
              <RetakeIcon /> Retake
            </Button>
          </section>
        )}
      </div>

      {capturedPhoto ? (
        <InsertCameraCapturedPhoto
          photo={capturedPhoto}
          setCapturedPhoto={setCapturedPhoto}
          closeOption={closeOption}
          replyMessage={replyMessage}
          setReplyMessage={setReplyMessage}
        />
      ) : (
        <Fragment>
          <div className="conversation-insert-camera-body">
            <video ref={playerRef} autoPlay />
          </div>

          <div
            className={`conversation-insert-camera-footer ${
              streaming && "show-capture-button"
            }`}
          >
            <IconButton onClick={captureImage}>
              <CameraAltOutlinedIcon />
            </IconButton>
            <canvas ref={canvasRef} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ConversationInsertCameraComponent;
