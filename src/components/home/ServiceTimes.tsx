import { Clock, Calendar, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Clock,
    title: "Sunday Worship",
    time: "10:00 AM",
    description: "Join us for uplifting worship and an inspiring message from God's Word.",
  },
  {
    icon: BookOpen,
    title: "Bible Study",
    time: "Wednesday 7:00 PM",
    description: "Dive deeper into Scripture and grow in your faith with our community.",
  },
  {
    icon: Users,
    title: "Sunday School",
    time: "9:00 AM",
    description: "Classes for all ages to learn and discuss biblical principles.",
  },
  {
    icon: Calendar,
    title: "Prayer Service",
    time: "Friday 7:00 - 8:00 PM",
    description: "Join us via Conference Line. Call 605-313-5980, Code: 866436#",
  },
];

const ServiceTimes = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-muted overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
          <p className="text-primary font-medium mb-2">Join Us</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Service Times
          </h2>
          <div className="section-divider" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We'd love to see you at any of our weekly gatherings. All are welcome!
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`card-hover hover-lift bg-card border-border ${
                isVisible 
                  ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 100}` 
                  : "opacity-0"
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 icon-bounce transition-colors duration-300 hover:bg-primary/20">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {service.title}
                </h3>
                <p className="text-primary font-medium text-lg mb-3">{service.time}</p>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTimes;
