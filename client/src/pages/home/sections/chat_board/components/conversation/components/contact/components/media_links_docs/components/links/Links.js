import {useState} from "react";
import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";
import {Checkbox} from "@mui/material";

import {LinkIcon} from "../../../../../../../../../../../../icons";

const label = {inputProps: {"aria-label": "Checkbox demo"}};

const LinksComponentEachLink = ({link, setSelected}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = event => {
    setIsChecked(event.target.checked);
    setSelected(prev =>
      prev.includes(link) ? prev.filter(item => item !== link) : [...prev, link]
    );
  };

  const isSent = true;

  return (
    <div className="links-component-each-link-container">
      <div
        className={`each-link-checkbox-container ${isChecked && "is-checked"}`}
      >
        <Checkbox
          {...label}
          color="default"
          checked={isChecked}
          onChange={handleCheckBoxChange}
        />
      </div>

      <div
        className={`link-details-container ${
          isSent ? "sent-link" : "received-link"
        }`}
      >
        <div className="left-stick" />
        {""}
        <div className="link-description-container">
          <div className="link-icon-container">
            <LinkIcon />
          </div>

          <div className="link-information-container">
            <p>https://www.youtube.com/watch?v=AaocZ-zSq2U</p>
            <small>www.youtube.com</small>
          </div>
          {""}
        </div>
        {""}
        <div className="actual-link-container">
          <a>https://www.youtube.com/watch?v=AaocZ-zSq2U</a>
        </div>
      </div>
    </div>
  );
};

const LinksComponent = ({containerRef, setSelected}) => {
  const links = [1, 2, 3];
  const theme = useSelector(state => state.app.theme);

  return (
    <Slide
      direction="left"
      in={true}
      mountOnEnter
      unmountOnExit
      container={containerRef.current}
    >
      <div className={`links-component-${theme}-theme`}>
        {links.map(link => {
          return (
            <LinksComponentEachLink link={link} setSelected={setSelected} />
          );
        })}
      </div>
    </Slide>
  );
};

export default LinksComponent;
