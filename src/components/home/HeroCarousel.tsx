import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ============================================
// CAROUSEL IMAGES - EASY TO EDIT
// To change photos: Simply update the import paths and carouselImages array
// To reorder: Change the order in the array below
// ============================================
import carousel1 from "@/assets/carousel/carousel-1.jpg";
import carousel2 from "@/assets/carousel/carousel-2.jpg";
import carousel3 from "@/assets/carousel/carousel-3.jpg";
import carousel4 from "@/assets/carousel/carousel-4.jpg";
import carousel5 from "@/assets/carousel/carousel-5.jpg";
import carousel6 from "@/assets/carousel/carousel-6.jpg";
import carousel7 from "@/assets/carousel/carousel-7.jpg";
import carousel8 from "@/assets/carousel/carousel-8.jpg";

// Edit this array to change carousel photos and their order
const carouselImages = [
  { src: carousel1, alt: "Church family fellowship" },
  { src: carousel2, alt: "Community serving together" },
  { src: carousel3, alt: "Youth ministry" },
  { src: carousel4, alt: "Church members embracing" },
  { src: carousel5, alt: "Fellowship dinner" },
  { src: carousel6, alt: "Family gathering" },
  { src: carousel7, alt: "Prayer service" },
  { src: carousel8, alt: "Worship service" },
];
// ============================================

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Overlay - positioned at bottom to not block images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content - positioned at bottom */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-20">
          <div className="max-w-2xl text-white animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg">
              Shiloh Old Site Baptist Church
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2 text-shadow">
              A Place for Grace and Growth
            </p>
            <p className="text-base md:text-lg text-white/80 mb-8 text-shadow">
              Working Together Building the Body of Christ One Disciple at a Time
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/visit">Join Us This Sunday</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
