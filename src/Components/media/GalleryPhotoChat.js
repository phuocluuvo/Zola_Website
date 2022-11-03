import React from "react";
import ReactBnbGallery from "react-bnb-gallery";

export const GalleryPhoto = ({ PHOTOS, index, isOpen, setIsOpen }) => {
  return (
    <>
      <ReactBnbGallery
        opacity={0.7}
        wrap
        activePhotoIndex={index}
        show={isOpen}
        photos={PHOTOS}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
