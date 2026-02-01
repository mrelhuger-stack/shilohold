import Layout from "@/components/layout/Layout";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  title: string | null;
  category: string;
  image_url: string | null;
  display_order: number;
}

const staffSections = [
  {
    name: "Ministerial Staff",
    description: "Our ministerial staff provides spiritual leadership, preaching, teaching, and pastoral care to our congregation. They guide our church in worship, discipleship, and ministry.",
  },
  {
    name: "Administration",
    description: "Our administrative team manages the day-to-day operations of the church, ensuring smooth coordination of ministries, communications, and organizational functions.",
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
  index,
  members,
}: { 
  section: typeof staffSections[0]; 
  index: number;
  members: StaffMember[];
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
          className={`max-w-6xl mx-auto ${
            animation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
          }`}
        >
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {section.name}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {section.description}
            </p>
          </div>

          {/* Staff Members Grid */}
          {members.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {members.map((member) => (
                <div key={member.id} className="text-center w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)]">
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-3 border border-border">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <User className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{member.name}</h3>
                  {member.title && (
                    <p className="text-muted-foreground text-xs">{member.title}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                Staff members coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMembersByCategory = (category: string) => {
    return staffMembers.filter(m => m.category === category);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 md:py-14 bg-secondary overflow-hidden">
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
        <StaffSection 
          key={section.name} 
          section={section} 
          index={index} 
          members={getMembersByCategory(section.name)}
        />
      ))}
    </Layout>
  );
};

export default StaffPage;
