import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'; // Thumbnail plugin
import 'yet-another-react-lightbox/plugins/thumbnails.css'; // Thumbnail plugin styles
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css'; // Required styles

// const selectedImages = [
//   "/images/banners/banner3.png",
//   "/images/banners/banner1.png",
//   "/images/banners/banner2.png",
// ];

const MyImageGallery = ({
    currentIndex = 0,
    imagePath,
    selectedImages,
    isOpenViewImages,
    setIsOpenViewImages,
}: {
    currentIndex?: number;
    imagePath: string;
    selectedImages: any;
    isOpenViewImages: boolean;
    setIsOpenViewImages: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const images = selectedImages?.map((imageObject: { image: string }) => ({ src: `${imagePath}${imageObject.image}` }));
    console.log(images);
    return (
        <div>
            <Lightbox
                open={isOpenViewImages}
                close={() => setIsOpenViewImages(false)}
                slides={images}
                index={currentIndex}
                plugins={[Thumbnails, Zoom]}
                carousel={{ finite: true }}
            />
        </div>
    );
};

export default MyImageGallery;
