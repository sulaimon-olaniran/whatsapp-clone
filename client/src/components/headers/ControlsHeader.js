import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {IconButton} from "@mui/material";
import {useSelector} from "react-redux";

const ControlHeaderComponent = ({action, title}) => {
  const theme = useSelector(state => state.app.theme);

  return (
    <header className={`control-header-component-${theme}-theme`}>
      <IconButton onClick={action}>
        <ArrowBackIcon />
      </IconButton>

      <p>{title}</p>
    </header>
  );
};

export default ControlHeaderComponent;
