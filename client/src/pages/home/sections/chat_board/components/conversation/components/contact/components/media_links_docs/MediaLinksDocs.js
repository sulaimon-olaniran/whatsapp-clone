import {Button, IconButton} from "@mui/material";
import {useState, useRef} from "react";
import {useSelector} from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import {
  ForwardIcon,
  DeleteIcon,
  StarIcon,
  CancelStarIcon,
} from "../../../../../../../../../../icons";
import MediaComponent from "./components/media/Media";
import DocsComponent from "./components/docs/Docs";
import LinksComponent from "./components/links/Links";
import ForwardMessageComponent from "../../../../../../../../../../components/forward_message/ForwardMessage";

const ConversationMediaDocsLinks = ({goBack}) => {
  const [activeComponent, setActiveComponent] = useState("media");
  const [selected, setSelected] = useState([]);
  const [forwardMessage, setForwardMessage] = useState(false);

  const containerRef = useRef(null);

  const theme = useSelector(state => state.app.theme);

  const handleToggleActiveComponent = component => {
    setSelected([]);
    setActiveComponent(component);
  };

  const handleOpenForwardMessageDialog = () => {
    setForwardMessage(true);
  };

  const handleCloseForwardMessageDialog = () => {
    setForwardMessage(false);
  };

  const style = {
    borderBottom: "4px solid #00a884",
    color: "#fff",
    fontWeight: 600,
  };
  return (
    <div className={`conversation-media-docs-links-${theme}-theme`}>
      <ForwardMessageComponent
        open={forwardMessage}
        handleClose={handleCloseForwardMessageDialog}
        message={selected[0]}
      />

      <header className="conversation-media-docs-links-header-container">
        <section className="header-top-section-container">
          {selected.length > 0 ? (
            <div className="header-is-selected-action-container">
              <div className="left-sided-contents">
                <IconButton onClick={() => setSelected([])}>
                  <CloseOutlinedIcon />
                </IconButton>
                <p>{selected.length} selected</p>
              </div>
              <div className="right-sided-contents">
                <IconButton>
                  <CancelStarIcon />
                </IconButton>

                <IconButton>
                  <DeleteIcon />
                </IconButton>

                <IconButton
                  onClick={handleOpenForwardMessageDialog}
                  disabled={selected.length > 1}
                >
                  <ForwardIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <IconButton onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
        </section>

        <section className="header-bottom-section-container">
          <Button
            onClick={() => handleToggleActiveComponent("media")}
            style={activeComponent === "media" ? {...style} : {}}
          >
            Media
          </Button>
          <Button
            onClick={() => handleToggleActiveComponent("docs")}
            style={activeComponent === "docs" ? {...style} : {}}
          >
            Docs
          </Button>
          <Button
            onClick={() => handleToggleActiveComponent("links")}
            style={activeComponent === "links" ? {...style} : {}}
          >
            Links
          </Button>
        </section>
      </header>

      <div
        className="conversation-media-docs-links-body-container"
        ref={containerRef}
      >
        {activeComponent === "media" && (
          <MediaComponent containerRef={containerRef} />
        )}
        {activeComponent === "docs" && (
          <DocsComponent containerRef={containerRef} />
        )}
        {activeComponent === "links" && (
          <LinksComponent
            containerRef={containerRef}
            setSelected={setSelected}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationMediaDocsLinks;
