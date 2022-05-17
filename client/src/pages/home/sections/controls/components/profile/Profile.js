import {useSelector} from "react-redux";

import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";

import ProfileNameInputComponent from "./components/NameInput";
import ProfileAboutInputComponent from "./components/AboutInput";
import ProfilePhotoComponent from "./components/photo/Photo";

const ControlsProfileComponent = ({deactiveControl}) => {
  const theme = useSelector(state => state.app.theme);
  //const user = useSelector(state => state.user.user);

  return (
    <div className={`controls-profile-component-${theme}-theme-container`}>
      <ControlHeaderComponent title={"Profile"} action={deactiveControl} />

      <div className="controls-profile-component-body-container">
        <ProfilePhotoComponent />

        <div className="control-profile-name-about-container">
          <div className="profile-name-about-inner-container">
            <ProfileNameInputComponent />
          </div>

          <div className="profile-name-information">
            <p>
              This is not your username or pin. This name will be visible to
              your WhatsApp contacts.
            </p>
          </div>

          <div className="profile-name-about-inner-container">
            <ProfileAboutInputComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsProfileComponent;
