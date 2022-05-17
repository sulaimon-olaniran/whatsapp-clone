import moment from "moment";

const MultipleImageMessagesComponent = ({message}) => {
  const {image, time} = message;
  return (
    <div className="multiple-image-messages-component-container">
      {image.map((image, index) => {
        return (
          <div key={index} className="multiple-image-each-image-container">
            <img src={image} alt="" />
            <p>{moment(time).format("LT")}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MultipleImageMessagesComponent;
