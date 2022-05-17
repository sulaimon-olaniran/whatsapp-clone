import {forwardRef} from "react";
import {useSelector} from "react-redux";
import Dialog from "@mui/material/Dialog";
import Zoom from "@mui/material/Zoom";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {ChatIcon} from "../../../../../icons";

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const SharedContactInfoComponent = ({open, handleClose, contacts}) => {
  const theme = useSelector(state => state.app.theme);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      //keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className={`shared-contact-info-component-${theme}-theme`}>
        <div className="shared-contact-info-header-container">
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <p>{contacts.length} contacts</p>
        </div>

        <div className="shared-contact-info-body-container">
          {contacts.map(contact => {
            return (
              <div
                className="each-contact-info-container"
                key={contact.username}
              >
                <section className="each-contact-info-top-section">
                  <Avatar src={contact.profile_photo} />
                  <p>{contact.username}</p>
                </section>
                <section className="each-contact-info-bottom-section">
                  <div>
                    <p>{contact.phone_number}</p>
                    <span>TEL</span>
                  </div>

                  <IconButton>
                    <ChatIcon />
                  </IconButton>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};

export default SharedContactInfoComponent;
