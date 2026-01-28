import Layout from "@/components/layout/Layout";
import { Heart, BookOpen, Users, Cross, Lightbulb, HandHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import pastorImage from "@/assets/pastor-patterson.png";
import firstLadyImage from "@/assets/first-lady-patterson.png";

const missionValues = [
  { icon: BookOpen, text: "Preach and teach the Gospel of Jesus Christ" },
  { icon: Heart, text: "Love God and love our neighbors as ourselves" },
  { icon: Users, text: "Build a community of faith, fellowship, and discipleship" },
  { icon: Cross, text: "Lead people to salvation through Jesus Christ" },
  { icon: Lightbulb, text: "Equip believers for ministry and spiritual growth" },
  { icon: HandHeart, text: "Serve our community with compassion and generosity" },
];

const leadershipTeam = [
  {
    name: "Pastor George Patterson",
    role: "Senior Pastor",
    image: pastorImage,
    bio: "Pastor George Patterson has faithfully led Shiloh Old Site Baptist Church for many years, guiding the congregation with wisdom, compassion, and a deep commitment to God's Word.",
  },
  {
    name: "First Lady Lashon Patterson",
    role: "First Lady",
    image: firstLadyImage,
    bio: "First Lady Patterson serves alongside Pastor Patterson, supporting the church's ministries and nurturing the spiritual growth of our church family.",
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

const AboutPage = () => {
  const historyAnimation = useScrollAnimation();
  const missionAnimation = useScrollAnimation();
  const leadershipAnimation = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            About Us
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            Learn about our history, mission, and the leadership that guides our church family.
          </p>
        </div>
      </section>

      {/* Church History */}
      <section 
        ref={historyAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className={`text-center mb-12 ${historyAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
              <p className="text-primary font-medium mb-2">Our Story</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Church History
              </h2>
              <div className="section-divider" />
            </div>

            <div className={`space-y-6 text-muted-foreground leading-relaxed ${historyAnimation.isVisible ? "opacity-100 animate-fade-in-up animation-delay-200" : "opacity-0"}`}>
              <p>
                Shiloh Old Site Baptist Church was established in 1870, making it one of the oldest 
                African American Baptist churches in Stafford County, Virginia. Founded by formerly 
                enslaved individuals seeking a place to worship freely, our church has stood as a 
                beacon of faith, hope, and community for over 150 years.
              </p>
              <p>
                Throughout our history, Shiloh has remained committed to the Gospel of Jesus Christ 
                and to serving our community. From humble beginnings, we have grown into a vibrant 
                congregation that continues to honor the legacy of our founders while embracing new 
                opportunities for ministry and outreach.
              </p>
              <p>
                Today, under the leadership of Pastor George Patterson, we carry forward the mission 
                of our forebears: working together to build the Body of Christ, one disciple at a time. 
                We invite you to become part of our continuing story as we serve God and our neighbors 
                with love and dedication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section 
        ref={missionAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-muted overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${missionAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">What We Believe</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mission & Values
            </h2>
            <div className="section-divider" />
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              "Working Together Building the Body of Christ One Disciple at a Time"
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {missionValues.map((value, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-6 bg-card rounded-lg border border-border hover-lift transition-all duration-300 hover:border-primary/30 ${
                  missionAnimation.isVisible 
                    ? `opacity-100 animate-scale-in animation-delay-${(index + 1) * 100}` 
                    : "opacity-0"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 icon-bounce transition-colors duration-300 hover:bg-primary/20">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-foreground">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section 
        ref={leadershipAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${leadershipAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Meet Our Leaders</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Church Leadership
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {leadershipTeam.map((leader, index) => (
                <div 
                  key={index} 
                  className={`bg-card rounded-xl border border-border overflow-hidden card-hover group ${
                    leadershipAnimation.isVisible 
                      ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 200}` 
                      : "opacity-0"
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden flex items-center justify-center bg-muted">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {leader.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">{leader.role}</p>
                    <p className="text-sm text-muted-foreground">{leader.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
