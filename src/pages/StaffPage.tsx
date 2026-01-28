import Layout from "@/components/layout/Layout";
import { useEffect, useRef, useState } from "react";

const staffSections = [
  {
    name: "Ministerial Staff",
    description: "Our ministerial staff provides spiritual leadership, preaching, teaching, and pastoral care to our congregation. They guide our church in worship, discipleship, and ministry.",
  },
  {
    name: "Trustees",
    description: "The Board of Trustees oversees the financial affairs and property management of the church. They ensure responsible stewardship of our facilities and resources.",
  },
  {
    name: "Deacons",
    description: "Our deacons serve as spiritual leaders who assist the pastor in ministry, caring for the needs of members, administering ordinances, and supporting the overall mission of the church.",
  },
  {
    name: "Ushers",
    description: "The usher ministry welcomes visitors and members, maintains order during services, assists with seating, and helps create a warm and reverent worship atmosphere.",
  },
  {
    name: "Praise and Worship",
    description: "Our praise and worship team leads the congregation in uplifting music and song, creating an atmosphere of worship and preparing hearts for the Word of God.",
  },
  {
    name: "Audio/Visual",
    description: "The audio/visual ministry ensures high-quality sound and visual presentations during services, manages live streaming, and provides technical support for all church events.",
  },
  {
    name: "Hospitality",
    description: "The hospitality ministry extends warmth and care through fellowship events, meals, and special occasions. They help create a welcoming environment for all who enter our doors.",
  },
];

const useScrollAnimation = (threshold = 0.2) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const StaffSection = ({ 
  section, 
  index 
}: { 
  section: typeof staffSections[0]; 
  index: number;
}) => {
  const animation = useScrollAnimation();
  const isEven = index % 2 === 0;

  return (
    <section
      ref={animation.ref as React.RefObject<HTMLElement>}
      className={`py-12 md:py-16 ${isEven ? "bg-background" : "bg-muted"}`}
    >
      <div className="container mx-auto px-4">
        <div 
          className={`max-w-5xl mx-auto ${
            animation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className={`grid md:grid-cols-2 gap-8 items-center ${
            !isEven ? "md:flex-row-reverse" : ""
          }`}>
            {/* Content */}
            <div className={`${!isEven ? "md:order-2" : ""}`}>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {section.name}
              </h2>
              <div className="w-16 h-1 bg-primary mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </div>

            {/* Photo Placeholder */}
            <div className={`${!isEven ? "md:order-1" : ""}`}>
              <div className="aspect-[4/3] bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-8 h-8 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {section.name} Photo
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Group photo placeholder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StaffPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Staff & Auxiliaries
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            Meet the dedicated teams who serve our church family and community.
          </p>
        </div>
      </section>

      {/* Staff Sections */}
      {staffSections.map((section, index) => (
        <StaffSection key={section.name} section={section} index={index} />
      ))}
    </Layout>
  );
};

export default StaffPage;
