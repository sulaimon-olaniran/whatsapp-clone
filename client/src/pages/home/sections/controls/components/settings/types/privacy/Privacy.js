import {useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Slide from "@mui/material/Slide";

import ControlHeaderComponent from "../../../../../../../../components/headers/ControlsHeader";
import PrivacySelectComponent from "./components/select/Select";
import {updateUserPrivacySettings} from "../../../../../../../../store/actions/user";
import PrivacyBlockContactsComponent from "./components/block/Block";

const PrivacySettings = ({closeSetting}) => {
  const [activePrivacy, setActivePrivacy] = useState("");
  const [showActivePrivacy, setShowActivePrivacy] = useState(false);

  const containerRef = useRef(null);

  const theme = useSelector(state => state.app.theme);
  const privacy = useSelector(state => state.user.user.privacy);

  const dispatch = useDispatch();

  const handleOpenActivePrivacy = privacy => {
    setActivePrivacy(privacy);
    setShowActivePrivacy(true);
  };

  const handleCloseActivePrivacy = () => {
    setActivePrivacy("");
    setShowActivePrivacy(false);
  };

  const handleUpdateReadReceipts = () => {
    const data = {
      ...privacy,
    };

    data["read_receipts"] = !privacy.read_receipts;
    dispatch(updateUserPrivacySettings(data));
  };

  return (
    <div className={`privacy-settings-${theme}-theme`} ref={containerRef}>
      <ControlHeaderComponent title="Privacy" action={closeSetting} />
      <div className="privacy-settings-sub-header">
        <h3>Who can see my personal info</h3>
      </div>

      <div className="privacy-settings-body-container">
        <section className="privacy-settings-body-first-section">
          <div
            className="each-first-section-action-container"
            onClick={() => handleOpenActivePrivacy("last_seen")}
          >
            <div>
              <p>Last seen</p>
              <span>{privacy?.last_seen}</span>
            </div>

            <ChevronRightIcon />
          </div>

          <div
            className="each-first-section-action-container"
            onClick={() => handleOpenActivePrivacy("profile_photo")}
          >
            <div>
              <p>Profile Photo</p>
              <span>{privacy?.profile_photo}</span>
            </div>

            <ChevronRightIcon />
          </div>

          <div
            className="each-first-section-action-container"
            onClick={() => handleOpenActivePrivacy("about")}
          >
            <div>
              <p>About</p>
              <span>{privacy?.about}</span>
            </div>

            <ChevronRightIcon />
          </div>

          <div
            className="each-first-section-action-container"
            onClick={handleUpdateReadReceipts}
          >
            <div>
              <p>Read Receipts</p>
              <span>
                If turned off, you won't send or receive Read receipts. Read
                receipts are always sent for group chats.
              </span>
            </div>

            <Checkbox checked={privacy?.read_receipts} />
          </div>
        </section>

        <section className="privacy-settings-body-second-section">
          <div
            className="each-second-section-action-container"
            onClick={() => handleOpenActivePrivacy("groups")}
          >
            <div>
              <p>Groups</p>
              <span>{privacy?.groups}</span>
            </div>

            <ChevronRightIcon />
          </div>

          <div
            className="each-second-section-action-container"
            onClick={() => handleOpenActivePrivacy("block_contacts")}
          >
            <div>
              <p>Block Contacts</p>
              <span>
                {privacy.blocked_contacts.length > 0
                  ? privacy.blocked_contacts.length
                  : "None"}
              </span>
            </div>

            <ChevronRightIcon />
          </div>
        </section>
      </div>

      <Slide
        direction="left"
        in={showActivePrivacy}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <div className="settings-setting-display-container">
          {activePrivacy.toLowerCase() === "last_seen" && (
            <PrivacySelectComponent
              closePrivacy={handleCloseActivePrivacy}
              title="Last Seen"
              subTitle="If you don't share your Last Seen, you won't be able to see other people's Last Seen."
              prevSelect={privacy?.last_seen}
              id="last_seen"
            />
          )}

          {activePrivacy.toLowerCase() === "profile_photo" && (
            <PrivacySelectComponent
              closePrivacy={handleCloseActivePrivacy}
              title="Profile Photo"
              subTitle="Who can see my Profile Photo"
              prevSelect={privacy?.profile_photo}
              id="profile_photo"
            />
          )}

          {activePrivacy.toLowerCase() === "about" && (
            <PrivacySelectComponent
              closePrivacy={handleCloseActivePrivacy}
              title="About"
              subTitle="Who can see my About"
              prevSelect={privacy?.about}
              id="about"
            />
          )}
          {activePrivacy.toLowerCase() === "groups" && (
            <PrivacySelectComponent
              closePrivacy={handleCloseActivePrivacy}
              title="Groups"
              subTitle="Who can add me to Groups"
              footerTitle="Admins who can't add you to a group will have the option of inviting you privately instead."
              prevSelect={privacy?.groups}
              id="groups"
            />
          )}
          {activePrivacy.toLowerCase() === "block_contacts" && (
            <PrivacyBlockContactsComponent
              closePrivacy={handleCloseActivePrivacy}
            />
          )}
        </div>
      </Slide>
    </div>
  );
};

export default PrivacySettings;
