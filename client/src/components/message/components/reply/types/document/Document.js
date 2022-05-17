import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {pdfjs} from "react-pdf";
import {Document, Page} from "react-pdf";

import {SmallDocumentIcon} from "../../../../../../icons";

const ReplyDocumentType = ({message, from}) => {
  const [docNumPages, setDocNumPages] = useState(null);
  const {sender, document} = message;

  const user = useSelector(state => state.user.user);
  const theme = useSelector(state => state.app.theme);

  const onDocumentLoadSuccess = ({numPages}) => {
    setDocNumPages(numPages);
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const extensionRegex = /(?:\.([^.]+))?$/;

  const docType = extensionRegex.exec(document.name)[1];

  return (
    <div
      className={`reply-document-type-container-${theme}-theme ${
        sender === user?._id && `reply-document-type-message-sent-${theme}`
      } ${from && "reply-document-from-input"}`}
    >
      <div className="reply-document-type-details-container">
        <div className="reply-document-type-sender-container">
          <p>{sender === user?._id ? "You" : "Michael Sabitzer"}</p>
        </div>

        <div className="reply-document-type-caption-container">
          <div className="reply-document-type-caption-text">
            <div className="caption-icon">
              <SmallDocumentIcon />
            </div>
            {docType === "pdf" ? (
              <span>
                {document.name} • {docNumPages} page
              </span>
            ) : (
              <span>{document.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="reply-document-type-document-container">
        {docType === "pdf" && (
          <div className="document-type-body-document-container">
            <Document file={document} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyDocumentType;
