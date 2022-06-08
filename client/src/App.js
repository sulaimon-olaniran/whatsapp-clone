import {Fragment, useEffect, useState} from "react";
import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {usePageVisibility} from "react-page-visibility";

import "./styles/styles.scss";

import {pusher} from "./constants";
import Homepage from "./pages/home/home";
import SigninPage from "./pages/signin/signin";
import SignupPage from "./pages/signup/signup";
import ViewProfilePhotoDialogComponent from "./components/view_profile_photo/ViewProfilePhoto";

import {fetchAccountData} from "./store/actions/user";
import {getAppUsers} from "./store/actions/app";
import {
  editMessage,
  fetchChats,
  newChatMessage,
  fetchStarredMessages,
} from "./store/actions/chat";

import MessagesMediasDialogComponent from "./components/medias_dialog/MediasDialog";
import {contactIsUpated} from "./store/actions/universal";
import axios from "axios";
import {userApi} from "./api";
import {InitializingAppLoader} from "./components/loaders/initializing/Initializing";
import SnackbarComponent from "./components/snackbar/Snackbar";
import UniversalLoader from "./components/loaders/universal/Universal";
import AvailabilityComponent from "./components/availability/Availability";

function App() {
  const [appLoader, setAppLoader] = useState(true);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);

  const fetchingUserData = useSelector(state => state.user.fetchingUserData);
  const fetchingAppUsers = useSelector(state => state.app.gettingAppUsers);
  const fetchingChats = useSelector(state => state.chat.fetchingChats);
  const fetchingStaredMessages = useSelector(
    state => state.chat.fetchingStaredMessages
  );

  const isVisible = usePageVisibility(); //CHECK IF PAGE IS ACTIVE OR NOT

  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAccountData());
    dispatch(getAppUsers());
    dispatch(fetchChats());
    dispatch(fetchStarredMessages());
  }, [token, dispatch]);

  //LISTENS TO WHEN MESSAGE IS EDITED SUCH AS WHEN MESSAGE IS DELETED FOR EVERYONE
  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");

    channel.bind("message-edited", function (data) {
      dispatch(editMessage(data));
    });

    return () => {
      channel.unbind("message-edited");
    };
  }, [dispatch]);

  //LISTENS TO WHEN A NEW MESSAGE IS RECEIVED IN THE SERVER
  useEffect(() => {
    const channel = pusher.subscribe("chat-channel");

    channel.bind("new-message", function (data) {
      //CHECK IF USER IS RECEIVER OF THE MESSAGE AND IF SENDER OF MESSAGE ISN'T BLOCKED
      if (
        data.sender === user?._id ||
        data.receiver !== user?._id ||
        user.privacy.blocked_contacts.includes(data.sender)
      )
        return;

      dispatch(newChatMessage(data._id));
    });

    return () => {
      channel.unbind("new-message");
    };
  }, [user, dispatch]);

  //LISTENS TO WHEN A USER ACCOUNT DATA HAS BEEN UPDATED
  useEffect(() => {
    const channel = pusher.subscribe("user-channel");

    channel.bind("user-updated", function (data) {
      //UPDATE CONTACT/USER WHEN UPDATE DOESN'T BELONGS TO LOGGED IN USER
      if (data.id === user?._id) return;
      dispatch(contactIsUpated(data.id));
    });

    return () => {
      channel.unbind("user-updated");
    };
  }, [user, dispatch]);

  //HANDLES USER PRESENCE STATUS
  useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        "oswc-auth-token": token,
      },
    };

    if (isVisible) {
      axios.post(`${userApi}/online`, {}, config);
    } else {
      axios.post(`${userApi}/offline`, {}, config);
    }
  }, [isVisible, token]);

  const isFetchingData =
    fetchingAppUsers ||
    fetchingUserData ||
    fetchingChats ||
    fetchingStaredMessages;

  const handleCloseAppLoader = () => {
    setAppLoader(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="app-screen-availability-container">
          <AvailabilityComponent />
        </div>
        <div className="main-app-container">
          {token && appLoader ? (
            <InitializingAppLoader
              loading={isFetchingData}
              closeLoader={handleCloseAppLoader}
            />
          ) : (
            <Fragment>
              <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route exact path="/signin" element={<SigninPage />} />
                <Route exact path="/signup" element={<SignupPage />} />
              </Routes>

              <ViewProfilePhotoDialogComponent />
              <MessagesMediasDialogComponent />
              <SnackbarComponent />
              <UniversalLoader />
            </Fragment>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
