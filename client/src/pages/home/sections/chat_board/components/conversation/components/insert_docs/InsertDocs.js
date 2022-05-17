import {useState, useRef, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import {styled} from "@mui/material/styles";
import {pdfjs} from "react-pdf";
import {Document, Page} from "react-pdf";
import {v4 as uuidv4} from "uuid";

//import {PDFtoIMG} from "react-pdf-to-image";

import {
  SendIcon,
  AdditionIcon,
  DocFileIcon,
} from "../../../../../../../../icons";
import {sendNewChatMessage} from "../../../../../../../../store/actions/chat";
import {docImage} from "../../../../../../../../constants";

const StyledBadge = styled(Badge)(({theme}) => ({
  "& .MuiBadge-badge": {
    right: +6,
    top: 8,
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#243545",
  },
}));

const ConversationInsertDocsComponent = ({
  closeOption,
  docs,
  setInsertedDocs,
  replyMessage,
  setReplyMessage,
}) => {
  const [selectedDoc, setSelectedDoc] = useState(docs[0]);

  const [docNumPages, setDocNumPages] = useState(null);

  const docFileInputRef2 = useRef(null);

  const dispatch = useDispatch();

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);
  const currentChat = useSelector(state => state.chat.currentChat);

  const handleOpenSelectDocs = () => {
    docFileInputRef2.current.click();
  };
  // console.log(PDFJS);

  const handleFileInputChange = event => {
    const selectedDocs = Array.from(event.target.files);
    setInsertedDocs(prev => prev.concat(selectedDocs));
  };

  const handleRemoveInsertedMedia = doc => {
    if (docs.length < 2) return closeOption();

    setInsertedDocs(prev => prev.filter(item => item !== doc));
    setSelectedDoc(docs[0]);
  };

  const onDocumentLoadSuccess = ({numPages}) => {
    setDocNumPages(numPages);
  };

  const sendeMessageDocumentType = () => {
    docs.forEach((doc, index) => {
      const message = {
        chatId: currentChat._id,
        sender: user._id,
        receiver: currentChat?.partnerData?._id,
        type: "document",
        isSent: false,
        isReply: replyMessage && index === 0 ? true : false,
        repliedTo: replyMessage && index === 0 ? replyMessage?._id : null,
        starred: [],
        time: Date.now(),
        subId: uuidv4(),
        document: doc,
      };

      dispatch(sendNewChatMessage(message));
      //console.log(message);
    });
    setReplyMessage(null);
    closeOption();
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  return (
    <div className={`conversation-insert-docs-component-${theme}-theme`}>
      <input
        type="file"
        name="insert_docs_input_2"
        id="insert_docs_input_2"
        accept=".pdf, .doc"
        ref={docFileInputRef2}
        multiple
        onChange={handleFileInputChange}
      />
      <div className="insert-docs-component-header-container">
        <IconButton onClick={closeOption}>
          <CloseIcon />
        </IconButton>

        <div className="doc-description-container">
          <p>{selectedDoc.name}</p>
          <small>{docNumPages} pages</small>
        </div>
      </div>

      <div className="insert-docs-component-body-container">
        <Document
          file={selectedDoc}
          onLoadSuccess={onDocumentLoadSuccess}
          error={
            <div className="doc-error-container">
              <DocFileIcon />
              <div>
                <h1>No Preview Available</h1>
                <p>{Math.round(selectedDoc.size / 1000)} KB - DOC</p>
              </div>
            </div>
          }
        >
          <Page pageNumber={1} />
        </Document>
      </div>

      <div className="insert-docs-component-footer-container">
        <div className="insert-docs-component-media-selection-container">
          <div className="docs-listed-section-container">
            <div className="selected-docs-list-container">
              {docs.map((doc, index) => {
                return (
                  <div
                    className={`each-doc-container ${
                      selectedDoc === doc && "doc-selected"
                    }`}
                    key={index}
                  >
                    <IconButton onClick={() => handleRemoveInsertedMedia(doc)}>
                      <CloseIcon />
                    </IconButton>

                    <Document
                      file={doc}
                      onClick={() => setSelectedDoc(doc)}
                      error={
                        <div style={{backgroundImage: `url(${docImage})`}} />
                      }
                    >
                      <Page pageNumber={1} />
                    </Document>
                  </div>
                );
              })}
            </div>

            <div className="add-doc-button" onClick={handleOpenSelectDocs}>
              <AdditionIcon />
            </div>
          </div>
          <StyledBadge badgeContent={docs.length}>
            <IconButton onClick={sendeMessageDocumentType}>
              <SendIcon />
            </IconButton>
          </StyledBadge>
        </div>
      </div>
    </div>
  );
};

export default ConversationInsertDocsComponent;
