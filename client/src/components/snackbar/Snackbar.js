import {Fragment} from "react";
import {useSelector, useDispatch} from "react-redux";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {CLOSE_SNACKBAR} from "../../store/types/universal";

const SnackbarComponent = () => {
  const theme = useSelector(state => state.app.theme);
  const open = useSelector(state => state.app.snackbar.open);
  const message = useSelector(state => state.app.snackbar.message);
  const undoAction = useSelector(state => state.app.snackbar.undoAction);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({
      type: CLOSE_SNACKBAR,
    });
  };

  const action = (
    <Fragment>
      {undoAction && (
        <Button color="secondary" size="small" onClick={undoAction}>
          UNDO
        </Button>
      )}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <div className={`snackbar-component-${theme}-theme`}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
};

export default SnackbarComponent;
