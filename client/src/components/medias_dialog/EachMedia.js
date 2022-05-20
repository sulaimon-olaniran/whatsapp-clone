const MediasDialogEachMedia = ({
  media,
  handleSelectMedia,
  selectedMedia,
  index,
}) => {
  const mediaId = media._id || media.subId;
  const selectedMediaId = selectedMedia?._id || selectedMedia?.subId;

  return (
    <div
      className={`medias-dialog-footer-each-media-container ${
        mediaId === selectedMediaId && "is-selected-media"
      }`}
      onClick={() => handleSelectMedia(media, index)}
    >
      <div className="medias-dialog-footer-each-media-inner-container">
        {media?.type === "image" ? (
          <img src={media?.image} alt="" />
        ) : (
          <img src={media?.gif} alt="" />
        )}
      </div>
    </div>
  );
};

export default MediasDialogEachMedia;
