
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function MyHero() {
  const images = [
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/image7.png",
    "assets/images/office.png",
    "assets/images/image6.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/office.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/office.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",
    "assets/images/image7.png",

    "assets/images/image7.png",
    "assets/images/image7.png",
  ];
  return (
    <div className="mx-auto my-6 max-w-screen-2xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
