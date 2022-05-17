import {useSelector} from "react-redux";
import {useState, useEffect} from "react";
import LinearProgress from "@mui/material/LinearProgress";

import {
  WhatsAppInitializingIcon,
  WhatsAppLaptopIcon,
  PadlockIcon,
  WhatsAppSVGIcon,
} from "../../../icons";

export const InitializingAppLoader = ({loading, closeLoader}) => {
  const theme = useSelector(state => state.app.theme);

  const [stoppedConnecting, setStoppedConnecting] = useState(false);
  const [downloadingMsgs, setDownloadingMsgs] = useState(false);
  const [stopDownloadingMsgs, setStopDownloadingMsgs] = useState(false);
  const [optimizingMsgs, setOptimizingMsgs] = useState(false);
  const [progress, setProgress] = useState(0);

  //RUN LOADING ACTIONS AFTER FETCH IS ACTUALLY COMPLETED
  useEffect(() => {
    if (!loading) {
      //PARENT SETTIMEOUT TO REMOVE CONNECTING FROM SCREEN
      setStoppedConnecting(true);

      //AFTER CONNECTING IS REMOVED, ADD DONWLOADING MESSAGES
      setTimeout(() => {
        setDownloadingMsgs(true);

        //STOP DOWNLOADING MESSAGES AFTER 5.6s, THE EXTRA 6ms IS SAME AMOUNT OF TIME FOR ANIMATION OF CSS
        setTimeout(() => {
          setStopDownloadingMsgs(true);

          //SHOW OPTIMIZING MESSAGES AFTER .6S, ALSO SAME AMOUNT FOR ANIMATION TO FINISH
          setTimeout(() => {
            setOptimizingMsgs(true);

            //STOP LOADER COMPONENT AFTER 1.5 SECOND AND DISPLAY APP
            setTimeout(() => {
              closeLoader();
            }, 1500);
          }, 600);
        }, 5600);
      }, 600);
    }
  }, [loading, closeLoader]);

  //WHEN PROGRESS/DOWNLOADING MESSAGES IS ACTIVE, ADDS THE VALUE OF 10 TO PROGRESS EVERY .5s TILL IT GETS TO VALUE OF 100
  useEffect(() => {
    let timer;
    if (progress - 100 === 0) return;

    if (downloadingMsgs) {
      timer = setInterval(() => {
        setProgress(prev => prev + 10);
      }, 500);
    }

    return () => {
      clearInterval(timer);
    };
  }, [downloadingMsgs, progress]);

  return (
    <div className={`initializing-app-loader-${theme}-theme`}>
      <div className="initializing-app-loader-contents-container">
        <div
          className={`loader-icons-container ${
            stoppedConnecting && "is-connecting"
          } ${downloadingMsgs && "is-initializing"} ${
            stopDownloadingMsgs && "stop-initializing"
          } ${optimizingMsgs && "is-completed"} `}
        >
          <div className="each-loader-icon whatsapp-icon">
            <WhatsAppSVGIcon width="52px" height="52px" />
          </div>

          <div className="each-loader-icon initializing-icon">
            <WhatsAppInitializingIcon />
          </div>

          <div className="each-loader-icon laptop-icon">
            <WhatsAppLaptopIcon />
          </div>
        </div>
        <div className="loader-line-container">
          <LinearProgress variant="determinate" value={progress} />
        </div>
        <div className="loader-info-container">
          <p>
            {loading && !stoppedConnecting && "Connecting..."}
            {stoppedConnecting &&
              !stopDownloadingMsgs &&
              `Downloading Messages ${progress}%`}
            {stopDownloadingMsgs && `Organizing Messages`}
          </p>
          <span>
            <PadlockIcon /> End-to-end encrypted
          </span>
        </div>
      </div>
    </div>
  );
};
