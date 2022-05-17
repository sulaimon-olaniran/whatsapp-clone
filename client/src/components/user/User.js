import {useSelector} from "react-redux";
import {Avatar} from "@mui/material";

const UserComponent = ({user, userAction, icon, type, disabled}) => {
  const theme = useSelector(state => state.app.theme);

  const handleUserAction = () => {
    if (disabled) return;

    userAction(user);
  };

  return (
    <div
      className={`user-component-${theme}-theme-container ${type} ${
        disabled && "disabled"
      }`}
      onClick={handleUserAction}
    >
      <Avatar src={user?.profile_photo} />
      <div className="user-information-container">
        <section>
          <span className="username-text">{user.username}</span>
          {disabled ? (
            <span className="blocked-text">Contact is blocked</span>
          ) : (
            <span className="about-text">{user.about}</span>
          )}
        </section>
        {icon && icon}
      </div>
    </div>
  );
};

export default UserComponent;
