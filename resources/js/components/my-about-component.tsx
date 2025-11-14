import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function MyAboutComponent() {
  const testimonials = [
    {
        id:1,
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "assets/images/about1.png",
    },
    {
        id:2,
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "assets/images/about2.png",
    },
    {
        id:3,
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "assets/images/about2.png",
    },

  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
