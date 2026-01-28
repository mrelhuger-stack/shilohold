import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CarouselImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images from database
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("carousel_images")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setImages(data);
      }
      setIsLoading(false);
    };

    fetchImages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("carousel_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "carousel_images",
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance carousel
  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, images.length]);

  // Reset currentIndex if it's out of bounds
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  if (isLoading) {
    return (
      <section className="relative h-[calc(100vh-80px)] min-h-[450px] max-h-[700px] overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative h-[calc(100vh-80px)] min-h-[450px] max-h-[700px] overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No carousel images available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[450px] max-h-[700px] overflow-hidden">
      {/* Background Images with zoom effect */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.image_url}
            alt={image.alt_text}
            className={`w-full h-full object-cover object-top transition-transform duration-[10000ms] ease-out ${
              index === currentIndex ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Overlay - positioned at bottom to not block images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content - positioned at bottom with staggered animations */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-10 md:pb-16">
          <div className="max-w-4xl text-white">
            {/* Main headline with dramatic styling */}
            <h1 className="font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-none mb-4 text-shadow-hero text-stroke opacity-0 animate-fade-in-up">
              <span className="block text-white">Shiloh</span>
              <span className="block text-gradient-gold drop-shadow-2xl" style={{ WebkitTextStroke: '0' }}>Old Site Baptist</span>
              <span className="block text-white">Church</span>
            </h1>
            {/* Tagline with gold accent */}
            <p className="font-heading text-xl sm:text-2xl md:text-3xl uppercase tracking-[0.15em] text-primary mb-2 text-glow-gold opacity-0 animate-fade-in-up animation-delay-200">
              A Place for Grace and Growth
            </p>
            <p className="font-sans text-sm md:text-base text-white/80 mb-6 text-shadow opacity-0 animate-fade-in-up animation-delay-300 max-w-xl">
              Working Together Building the Body of Christ One Disciple at a Time
            </p>
            <div className="flex flex-wrap gap-3 opacity-0 animate-fade-in-up animation-delay-500">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-base uppercase tracking-wider px-6 py-5 shimmer-bg hover:animate-shimmer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                <Link to="/visit">Join Us This Sunday</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-foreground backdrop-blur-sm font-heading text-base uppercase tracking-wider px-6 py-5 transition-all duration-300 hover:scale-105">
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
        {images.map((image, index) => (
          <button
            key={image.id}
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
