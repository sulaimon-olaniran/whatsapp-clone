import {forwardRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {closeProfilePhoto} from "../../store/actions/app";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

const ViewProfilePhotoDialogComponent = () => {
  const theme = useSelector(state => state.app.theme);
  const data = useSelector(state => state.app.profilePhotoDialog);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeProfilePhoto());
  };

  return (
    <Dialog
      open={data.open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      fullScreen
    >
      <div
        className={`view-profile-photo-dialog-component-${theme}-theme`}
        onClick={handleClose}
      >
        <div className="view-profile-photo-dialog-header">
          <div>
            <Avatar src={data.image} />
            <p>{data.name}</p>
          </div>

          <IconButton size="medium" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="view-profile-photo-dialog-image-container">
          <img src={data.image} alt={data.name} />
        </div>
      </div>
    </Dialog>
  );
};

export default ViewProfilePhotoDialogComponent;
