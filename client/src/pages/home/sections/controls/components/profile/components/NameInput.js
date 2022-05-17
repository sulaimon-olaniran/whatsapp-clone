import {Fragment, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import {CircularProgress} from "@mui/material";

import InputEmojisComponent from "../../../../../../../components/emoji/input/Input";

import {updateUserData} from "../../../../../../../store/actions/user";

const ProfileNameInputComponent = () => {
  const [editName, setEditName] = useState(false);

  const user = useSelector(state => state.user.user);
  //const updating = useSelector(state => state.user.updatingUser);

  const [nameInputValue, setNameInputValue] = useState(user?.username);

  const dispatch = useDispatch();

  const handleNameInputChange = event => {
    setNameInputValue(event.target.value);
  };

  const handleEditNameInput = () => {
    setEditName(true);
  };

  const handleCloseEditNameInput = () => {
    setEditName(false);
  };

  const handleUpdateUserName = () => {
    if (nameInputValue === user?.username) return handleCloseEditNameInput();

    const data = {
      type: "name",
      update: {
        username: nameInputValue,
      },
    };

    dispatch(updateUserData(data, handleCloseEditNameInput));
  };

  return (
    <div className="name-about-input-container">
      <div className="input-label-container">
        <p>Your name</p>
      </div>

      <div
        className={`input-textfield-container ${
          editName ? "input-active" : ""
        }`}
      >
        {/* {updating.isUpdating && updating.type === "name" && (
          <div className="input-textfield-updating-container">
            <CircularProgress />
          </div>
        )} */}
        <input
          value={nameInputValue}
          readOnly={!editName}
          onChange={handleNameInputChange}
          maxLength={25}
        />

        <div className="input-button-actions-container">
          {editName ? (
            <Fragment>
              <IconButton>{25 - nameInputValue.length}</IconButton>

              <InputEmojisComponent setState={setNameInputValue} />

              <IconButton size="small" onClick={handleUpdateUserName}>
                <CheckOutlinedIcon />
              </IconButton>
            </Fragment>
          ) : (
            <IconButton size="small" onClick={handleEditNameInput}>
              <CreateIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNameInputComponent;
