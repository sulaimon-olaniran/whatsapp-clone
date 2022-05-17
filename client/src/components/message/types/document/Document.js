import {useEffect, useState, Fragment} from "react";
import {useSelector} from "react-redux";
import {pdfjs} from "react-pdf";
import {Document, Page} from "react-pdf";
import moment from "moment";

import MessageStatusComponent from "../../components/status/Status";
import {SmallStarIcon} from "../../../../icons";
import {pdfIconImage, docIconImage} from "../../../../constants";

const MessageDocumentType = ({message}) => {
  const [docNumPages, setDocNumPages] = useState(null);

  const {sender, document} = message;

  const theme = useSelector(state => state.app.theme);
  const user = useSelector(state => state.user.user);

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
      className={`message-document-type-${theme}-theme ${
        sender === user._id ? "document-was-sent" : "document-was-received"
      }`}
    >
      <div className="message-document-type-body-container">
        {docType === "pdf" && (
          <div className="document-type-body-document-container">
            <Document
              file={document}
              onLoadSuccess={onDocumentLoadSuccess}
              // error={
              //   <div className="doc-error-container">
              //     <DocFileIcon />{" "}
              //     <div>
              //       <h1>No Preview Available</h1>
              //       <p>{Math.round(selectedDoc.size / 1000)} KB - DOC</p>
              //     </div>
              //   </div>
              // }
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        )}

        <div className="document-type-body-document-name">
          {docType === "pdf" ? (
            <img src={pdfIconImage} alt="pdf" />
          ) : (
            <img src={docIconImage} alt="pdf" />
          )}
          <p>Ebidhaa Request Letter</p>
        </div>
      </div>

      <div className="message-document-type-footer-container">
        <div className="document-footer-info-container">
          {docType === "pdf" && (
            <Fragment>
              <p>{docNumPages} page</p>
              <span>•</span>
            </Fragment>
          )}

          {docType === "pdf" ? <p>PDF</p> : <p>DOC</p>}

          <span>•</span>

          <p>{Math.round(document.size / 1000)} KB</p>
        </div>

        <div className="message-document-type-time-container">
          {message?.starred?.includes(user._id) && <SmallStarIcon />}
          <p>{moment(message.time).format("LT")}</p>
          <MessageStatusComponent message={message} />
        </div>
      </div>
    </div>
  );
};

export default MessageDocumentType;
