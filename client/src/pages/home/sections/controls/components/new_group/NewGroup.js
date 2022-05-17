import {useState, useRef, useEffect, Fragment} from "react";
import {useSelector} from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {Avatar, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import ControlHeaderComponent from "../../../../../../components/headers/ControlsHeader";
import UsersListComponent from "../../../../../../components/users_list/UsersList";

//import contacts from "../../../../../../jsons/contacts.json";
import CompleteNewGroupComponent from "./complete/Complete";

const ControlsNewGroupComponent = ({deactiveControl}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [nextStep, setNextStep] = useState(false);

  const theme = useSelector(state => state.app.theme);
  const users = useSelector(state => state.app.users);
  const showFooter = selectedUsers.length > 0 ? true : false;

  const containerRef = useRef(null);
  const selectedUsersRef = useRef(null);
  const slideContainerRef = useRef(null);

  const handleAddSelectedUser = user => {
    if (selectedUsers.includes(user)) return;
    setSelectedUsers(prev => [...prev, user]);
  };

  const handleRemoveSelectedUser = user => {
    setSelectedUsers(prev => prev.filter(item => item !== user));
  };

  const handleGoToNextStep = () => {
    setNextStep(true);
  };

  const handleGoBackPrevStep = () => {
    setNextStep(false);
  };

  useEffect(() => {
    setContainerHeight(containerRef.current.clientHeight);
    selectedUsersRef.current.scrollTo(
      0,
      selectedUsersRef.current.scrollHeight,
      "auto"
    );
  }, [selectedUsers]);

  return (
    <div
      className={`controls-new-group-component-${theme}-theme ${theme}-text`}
      ref={slideContainerRef}
    >
      <ControlHeaderComponent
        action={deactiveControl}
        title="Add group participants"
      />

      <div className="controls-new-group-search-container" ref={containerRef}>
        <div className="selected-users-list-container" ref={selectedUsersRef}>
          {selectedUsers.length > 0 &&
            selectedUsers.map(user => {
              return (
                <div
                  className="each-selected-user-container"
                  key={user.username}
                >
                  <Avatar src={user.profile_photo} />
                  <p>{user.username}</p>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveSelectedUser(user)}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              );
            })}
        </div>

        <input placeholder="Type contact name" />
      </div>

      <div
        className="controls-new-group-body-container"
        style={{maxHeight: `calc(100% - ${containerHeight}px - 13rem)`}}
      >
        <UsersListComponent
          contacts={users}
          action={handleAddSelectedUser}
          selectedContacts={selectedUsers}
        />
      </div>

      <div
        className={`controls-new-group-footer-container ${
          showFooter && "show-footer"
        }`}
      >
        <IconButton size="large" onClick={handleGoToNextStep}>
          <ArrowForwardIcon />
        </IconButton>
      </div>

      <Slide
        direction="left"
        in={nextStep}
        mountOnEnter
        unmountOnExit
        container={slideContainerRef.current}
      >
        <div className="controls-new-group-slide-container">
          <CompleteNewGroupComponent goBack={handleGoBackPrevStep} />
        </div>
      </Slide>
    </div>
  );
};

export default ControlsNewGroupComponent;
