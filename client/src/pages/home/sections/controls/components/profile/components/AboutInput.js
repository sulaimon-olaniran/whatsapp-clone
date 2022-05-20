import {Fragment, useState} from "react";
import {IconButton, TextareaAutosize} from "@mui/material";
import {useSelector, useDispatch} from "react-redux";
import CreateIcon from "@mui/icons-material/Create";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import InputEmojisComponent from "../../../../../../../components/emoji/input/Input";
import {updateUserData} from "../../../../../../../store/actions/user";

const ProfileAboutInputComponent = () => {
  const [editAbout, setEditAbout] = useState(false);

  const user = useSelector(state => state.user.user);

  const [aboutInputValue, setAboutInputValue] = useState(user?.about);

  const dispatch = useDispatch();

  const handleAboutInputChange = event => {
    setAboutInputValue(event.target.value);
  };

  const handleEditAboutInput = () => {
    setEditAbout(true);
  };

  const handleCloseEditAboutInput = () => {
    setEditAbout(false);
  };

  const handleUpdateUserAbout = () => {
    if (aboutInputValue === user?.about) return handleCloseEditAboutInput();

    const data = {
      type: "about",
      update: {
        about: aboutInputValue,
      },
    };

    dispatch(updateUserData(data, handleCloseEditAboutInput));
  };

  return (
    <div className="name-about-input-container">
      <div className="input-label-container">
        <p>About</p>
      </div>

      <div
        className={`input-textfield-container ${
          editAbout ? "input-active" : ""
        }`}
      >
        <TextareaAutosize
          aria-label="empty textarea"
          maxRows={5}
          minRows={1}
          onChange={handleAboutInputChange}
          value={aboutInputValue}
          readOnly={!editAbout}
          maxLength={100}
        />

        <div className="input-button-actions-container">
          {editAbout ? (
            <Fragment>
              {aboutInputValue.length > 49 && (
                <IconButton>{100 - aboutInputValue.length}</IconButton>
              )}

              <InputEmojisComponent setState={setAboutInputValue} />

              <IconButton size="small" onClick={handleUpdateUserAbout}>
                <CheckOutlinedIcon />
              </IconButton>
            </Fragment>
          ) : (
            <IconButton size="small" onClick={handleEditAboutInput}>
              <CreateIcon />
            </IconButton>
          )}
        </div>
      </div>

      {/* hello */}
    </div>
  );
};

export default ProfileAboutInputComponent;
