import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Required styles
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"; // Thumbnail plugin
import "yet-another-react-lightbox/plugins/thumbnails.css"; // Thumbnail plugin styles
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";

const photos = [
  "/assets/nokor-tech/images/banners/banner3.png",
  "/assets/nokor-tech/images/banners/banner1.png",
  "/assets/nokor-tech/images/banners/banner2.png",
];

const MyImageGallery = () => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = photos.map((src) => ({ src })); // Convert photos array to Lightbox format

  return (
    <div>
      {/* Large image at the top */}
      <div className="w-full mb-2">
        <img
          width={400}
          height={400}
          src={photos[0]}
          alt="Large Image"
          className="w-full aspect-square object-cover rounded-lg"
          onClick={() => {
            setCurrentIndex(0);
            setOpen(true);
          }}
        />
      </div>

      {/* Thumbnails for the rest of the images */}
      <div className="grid grid-cols-4 gap-2">
        {photos.slice(1).map((photo, index) => (
          <img
            width={400}
            height={400}
            key={index}
            src={photo}
            alt={`Image ${index + 2}`} // Adjusted index for thumbnails
            className="w-full aspect-square object-cover cursor-pointer rounded-lg"
            onClick={() => {
              setCurrentIndex(index + 1); // Adjust index for thumbnails
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        plugins={[Thumbnails, Zoom, Slideshow, Fullscreen]}
      />
    </div>
  );
};

export default MyImageGallery;
