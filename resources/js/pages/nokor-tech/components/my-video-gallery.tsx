import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const videos = [
  // Url MP4
  {
    id: 1,
    src: "https://www.youtube.com/embed/J0NuOlA2xDc?si=IiGdSgybkKc3-Uem",
    title: "Video 1",
    thumb: "/assets/nokor-tech/images/banners/banner1.png",
  },
  // Iframe
  {
    id: 2,
    src: '<iframe width="560" height="315" src="https://www.youtube.com/embed/q1qKv5TBaOA?si=DLEjp-qL6slnc09p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
    title: "Video 2",
    thumb: "/assets/nokor-tech/images/thumb/1.png",
  },
  // Youtube Embed
  {
    id: 3,
    src: 'https://www.youtube.com/embed/J0NuOlA2xDc?si=IiGdSgybkKc3-Uem',
    title: "Video 2",
    thumb: "/assets/nokor-tech/images/thumb/2.png",
  },
  // Locale
  {
    id: 3,
    src: "https://www.youtube.com/embed/J0NuOlA2xDc?si=IiGdSgybkKc3-Uem",
    title: "Video 3",
    thumb: "/assets/nokor-tech/images/banners/banner3.png",
  },
];

export default function MyVideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log(`Currently displaying: ${videos[currentIndex].title}`);
    }
  }, [currentIndex, isOpen]);

  const getVideoUrl = (src: string) => {
    // Check if the src is an iframe HTML string
    const iframeRegex = /<iframe.*?src="(.*?)"/;
    const match = src.match(iframeRegex);
    return match ? match[1] : src; // Return the extracted URL or the original src
  };

  const nextSlide = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <>
      <div className={`grid grid-cols-2 lg:grid-cols-3 gap-2 xl:grid-cols-4`}>
        {videos.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index); // Set current video index
              setIsOpen(true); // Open the lightbox
            }}
          >
            <div className="w-full relative aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden">
              <img
                width={400}
                height={400}
                src={item.thumb} // Replace with dynamic thumbnail if available
                alt={item.title}
                className="w-full aspect-video object-cover transition-all duration-300 transform group-hover:scale-105"
              />
              <span className="absolute border-[0.5px] -translate-x-1/2 group-hover:bg-primary bg-primary/80 rounded-full p-1.5 -translate-y-1/2 text-white top-[50%] left-[50%]">
                <Play size={24} />
              </span>
            </div>
            <div className="mt-1 text-center text-sm font-medium text-gray-700 group-hover:text-blue-500">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full px-14 bg-black border-none h-full flex flex-col">
          <DialogTitle className="hidden" />
          <DialogDescription className="hidden" />
          <div className="relative flex-grow">
            <iframe
              src={`${getVideoUrl(videos[currentIndex].src)}?&autoplay=1`} // Ensure autoplay works on YouTube
              className="rounded-2xl w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute group top-1/2 left-2 transform -translate-y-1/2"
            onClick={prevSlide}
            aria-label="Previous video"
            disabled={currentIndex === 0} // Disable button if on the first video
          >
            <ChevronLeft
              className="text-white group-hover:text-black"
              size={28}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute group top-1/2 right-2 transform -translate-y-1/2"
            onClick={nextSlide}
            aria-label="Next video"
            disabled={currentIndex === videos.length - 1} // Disable button if on the last video
          >
            <ChevronRight
              className="text-white group-hover:text-black"
              size={28}
            />
          </Button>
        </DialogContent>
      </Dialog>
    </>

  );
}
