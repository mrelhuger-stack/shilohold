import Layout from "@/components/layout/Layout";
import { MapPin, Car, Clock, Users, Heart, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const expectations = [
  {
    icon: Clock,
    title: "Service Length",
    description: "Our Sunday worship service typically lasts about 1.5 to 2 hours.",
  },
  {
    icon: Users,
    title: "Dress Code",
    description: "Come as you are! We welcome you whether you're dressed up or casual.",
  },
  {
    icon: Heart,
    title: "Children's Programs",
    description: "We offer Sunday School for all ages at 9:00 AM. Children are welcome in worship too!",
  },
  {
    icon: HelpCircle,
    title: "First-Time Visitors",
    description: "Greeters will welcome you and help you find your way. Feel free to ask questions!",
  },
];

const VisitPage = () => {
  const mapAnimation = useScrollAnimation();
  const expectationsAnimation = useScrollAnimation();
  const timesAnimation = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Plan Your Visit
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            We can't wait to meet you! Here's everything you need to know before your first visit.
          </p>
        </div>
      </section>

      {/* Map & Directions */}
      <section 
        ref={mapAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className={`w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-border ${
              mapAnimation.isVisible ? "opacity-100 animate-slide-in-left" : "opacity-0"
            }`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.123!2d-77.4183!3d38.4828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b6e8a5b5b5b5b5%3A0x1234567890!2s1855+Garrisonville+Rd%2C+Stafford%2C+VA+22556!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Church Location"
              />
            </div>

            {/* Address & Parking Info */}
            <div className={`space-y-8 ${mapAnimation.isVisible ? "opacity-100 animate-slide-in-right" : "opacity-0"}`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Our Location
                    </h2>
                  </div>
                </div>
                <address className="not-italic text-muted-foreground leading-relaxed ml-15 pl-[60px]">
                  1855 Garrisonville Road<br />
                  Stafford, VA 22556
                </address>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center icon-bounce">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Parking & Accessibility
                    </h2>
                  </div>
                </div>
                <div className="text-muted-foreground leading-relaxed ml-15 pl-[60px] space-y-3">
                  <p>
                    Free parking is available in our church lot. Handicap-accessible parking spaces 
                    are located near the main entrance.
                  </p>
                  <p>
                    Our facility is wheelchair accessible with ramps and accessible restrooms available.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-xl hover-lift">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Directions
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Located on Garrisonville Road (Route 610) in Stafford, Virginia. We are easily 
                  accessible from I-95 and Route 1. Look for our church sign on the right when 
                  heading east on Garrisonville Road.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section 
        ref={expectationsAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-muted overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${expectationsAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Your First Visit</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What to Expect
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {expectations.map((item, index) => (
              <Card 
                key={index} 
                className={`card-hover hover-lift bg-card border-border ${
                  expectationsAnimation.isVisible 
                    ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 100}` 
                    : "opacity-0"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 icon-bounce transition-colors duration-300 hover:bg-primary/20">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section 
        ref={timesAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`max-w-2xl mx-auto text-center ${timesAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Join Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Service Times
            </h2>
            <div className="section-divider mb-8" />
            
            <div className="space-y-4">
              <div className={`bg-muted p-6 rounded-xl hover-lift ${
                timesAnimation.isVisible ? "opacity-100 animate-scale-in animation-delay-200" : "opacity-0"
              }`}>
                <h3 className="font-display text-xl font-semibold text-foreground">Sunday</h3>
                <p className="text-primary font-medium text-lg mt-1">Sunday School: 9:00 AM</p>
                <p className="text-primary font-medium text-lg">Worship Service: 10:00 AM</p>
              </div>
              <div className={`bg-muted p-6 rounded-xl hover-lift ${
                timesAnimation.isVisible ? "opacity-100 animate-scale-in animation-delay-400" : "opacity-0"
              }`}>
                <h3 className="font-display text-xl font-semibold text-foreground">Wednesday</h3>
                <p className="text-primary font-medium text-lg mt-1">Bible Study: 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VisitPage;
