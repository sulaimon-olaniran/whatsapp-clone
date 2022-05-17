import {useSelector} from "react-redux";
import Slide from "@mui/material/Slide";

const DocsComponent = ({containerRef}) => {
  const theme = useSelector(state => state.app.theme);
  return (
    <Slide
      direction="left"
      in={true}
      mountOnEnter
      unmountOnExit
      container={containerRef.current}
    >
      <div className={`docs-component-${theme}-theme`}>
        <div className="no-docs-container">
          <p>No Docs</p>
        </div>
      </div>
    </Slide>
  );
};

export default DocsComponent;
