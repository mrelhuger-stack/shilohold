import Layout from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// ============================================
// EVENTS DATA - EASY TO EDIT
// Add, remove, or modify events in this array
// ============================================
const events = [
  {
    title: "Sunday Worship Service",
    date: "Every Sunday",
    time: "10:00 AM",
    location: "Main Sanctuary",
    description: "Join us for a time of worship, prayer, and a message from God's Word. All are welcome to experience the love of Christ with our church family.",
    recurring: true,
    category: "Worship",
  },
  {
    title: "Wednesday Bible Study",
    date: "Every Wednesday",
    time: "7:00 PM",
    location: "Fellowship Hall",
    description: "Dive deeper into Scripture with our midweek Bible study. Open discussion and practical application for daily living.",
    recurring: true,
    category: "Study",
  },
  {
    title: "Youth Ministry Meeting",
    date: "Every Friday",
    time: "6:30 PM",
    location: "Youth Room",
    description: "A fun and faith-filled time for our youth ages 12-18. Games, worship, and age-appropriate Bible teaching.",
    recurring: true,
    category: "Youth",
  },
  {
    title: "Women's Fellowship Breakfast",
    date: "February 15, 2026",
    time: "9:00 AM",
    location: "Fellowship Hall",
    description: "Ladies, join us for a special morning of fellowship, food, and encouragement. Guest speaker to be announced.",
    recurring: false,
    category: "Fellowship",
  },
  {
    title: "Community Outreach Day",
    date: "February 22, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Church Grounds",
    description: "Serve our community through various outreach activities including food distribution, clothing drive, and prayer stations.",
    recurring: false,
    category: "Outreach",
  },
];

const categoryColors: Record<string, string> = {
  Worship: "bg-primary/10 text-primary border-primary/30",
  Study: "bg-secondary/20 text-secondary border-secondary/30",
  Youth: "bg-accent/20 text-accent border-accent/30",
  Fellowship: "bg-church-gold/10 text-church-gold-dark border-church-gold/30",
  Outreach: "bg-church-green/10 text-church-green border-church-green/30",
};

const EventsPage = () => {
  const recurringEvents = events.filter((e) => e.recurring);
  const upcomingEvents = events.filter((e) => !e.recurring);
  
  const recurringAnimation = useScrollAnimation();
  const upcomingAnimation = useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Events
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            Stay connected with what's happening at Shiloh. Join us for worship, fellowship, and community events.
          </p>
        </div>
      </section>

      {/* Recurring Events */}
      <section 
        ref={recurringAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-background overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${recurringAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Weekly Gatherings</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Regular Events
            </h2>
            <div className="section-divider" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {recurringEvents.map((event, index) => (
              <Card 
                key={index} 
                className={`card-hover hover-lift bg-card border-border ${
                  recurringAnimation.isVisible 
                    ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 100}` 
                    : "opacity-0"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className={categoryColors[event.category]}>
                      {event.category}
                    </Badge>
                    <Badge variant="secondary">Recurring</Badge>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section 
        ref={upcomingAnimation.ref as React.RefObject<HTMLElement>} 
        className="py-16 md:py-24 bg-muted overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${upcomingAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-primary font-medium mb-2">Mark Your Calendar</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={index} 
                className={`card-hover hover-lift bg-card border-border overflow-hidden ${
                  upcomingAnimation.isVisible 
                    ? `opacity-100 animate-slide-in-left animation-delay-${(index + 1) * 200}` 
                    : "opacity-0"
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-primary p-6 md:p-8 flex flex-col items-center justify-center md:w-48 shrink-0">
                      <span className="text-primary-foreground text-sm font-medium">
                        {event.date.split(",")[0]}
                      </span>
                      <span className="text-primary-foreground/80 text-sm">
                        {event.time}
                      </span>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <Badge variant="outline" className={categoryColors[event.category]}>
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`text-center mt-12 ${upcomingAnimation.isVisible ? "opacity-100 animate-fade-in-up animation-delay-600" : "opacity-0"}`}>
            <Button asChild variant="outline" className="transition-all duration-300 hover:scale-105">
              <Link to="/contact">
                Contact us for more information
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
