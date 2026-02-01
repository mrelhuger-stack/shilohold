import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, ArrowRight, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string | null;
  category: string;
  recurring: boolean;
}

const categoryColors: Record<string, string> = {
  Worship: "bg-primary/10 text-primary border-primary/30",
  Study: "bg-secondary/20 text-secondary border-secondary/30",
  Youth: "bg-accent/20 text-accent border-accent/30",
  Fellowship: "bg-church-gold/10 text-church-gold-dark border-church-gold/30",
  Outreach: "bg-church-green/10 text-church-green border-church-green/30",
  General: "bg-muted text-muted-foreground border-border",
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const recurringAnimation = useScrollAnimation();
  const upcomingAnimation = useScrollAnimation();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setAnnouncements(data);
      }
      setIsLoading(false);
    };

    fetchAnnouncements();
  }, []);

  const recurringAnnouncements = announcements.filter((a) => a.recurring);
  const upcomingAnnouncements = announcements.filter((a) => !a.recurring);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 md:py-14 bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 opacity-0 animate-fade-in-down">
            Announcements
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up animation-delay-200">
            Stay connected with what's happening at Shiloh. Join us for worship, fellowship, and community events.
          </p>
        </div>
      </section>

      {isLoading ? (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        </section>
      ) : (
        <>
          {/* Recurring Announcements */}
          <section
            ref={recurringAnimation.ref as React.RefObject<HTMLElement>}
            className="py-16 md:py-24 bg-background overflow-hidden"
          >
            <div className="container mx-auto px-4">
              <div
                className={`text-center mb-12 transition-opacity duration-500 ${
                  recurringAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-100"
                }`}
              >
                <p className="text-primary font-medium mb-2">Weekly Gatherings</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Regular Events
                </h2>
                <div className="section-divider" />
              </div>

              <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                {recurringAnnouncements.length === 0 ? (
                  <p className="text-center text-muted-foreground col-span-full py-8">
                    No recurring announcements at this time.
                  </p>
                ) : (
                  recurringAnnouncements.map((announcement, index) => (
                    <Card
                      key={announcement.id}
                      className={`card-hover hover-lift bg-card border-border transition-opacity duration-500 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                        recurringAnimation.isVisible
                          ? `opacity-100 animate-fade-in-up animation-delay-${(index + 1) * 100}`
                          : "opacity-100"
                      }`}
                    >
                      <CardContent className="p-0">
                        {/* Image Placeholder */}
                        {announcement.image_url ? (
                          <img
                            src={announcement.image_url}
                            alt={announcement.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Badge
                              variant="outline"
                              className={categoryColors[announcement.category] || categoryColors.General}
                            >
                              {announcement.category}
                            </Badge>
                            <Badge variant="secondary">Recurring</Badge>
                          </div>
                          <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                            {announcement.title}
                          </h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              {announcement.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              {announcement.time}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              {announcement.location}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Upcoming Announcements */}
          <section
            ref={upcomingAnimation.ref as React.RefObject<HTMLElement>}
            className="py-16 md:py-24 bg-muted overflow-hidden"
          >
            <div className="container mx-auto px-4">
              <div
                className={`text-center mb-12 transition-opacity duration-500 ${
                  upcomingAnimation.isVisible ? "opacity-100 animate-fade-in-up" : "opacity-100"
                }`}
              >
                <p className="text-primary font-medium mb-2">Mark Your Calendar</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Upcoming Events
                </h2>
                <div className="section-divider" />
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {upcomingAnnouncements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No upcoming announcements at this time.
                  </p>
                ) : (
                  upcomingAnnouncements.map((announcement, index) => (
                    <Card
                      key={announcement.id}
                      className={`card-hover hover-lift bg-card border-border overflow-hidden transition-opacity duration-500 ${
                        upcomingAnimation.isVisible
                          ? `opacity-100 animate-slide-in-left animation-delay-${(index + 1) * 200}`
                          : "opacity-100"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Image or Date Section */}
                          {announcement.image_url ? (
                            <img
                              src={announcement.image_url}
                              alt={announcement.title}
                              className="w-full md:w-64 h-48 md:h-auto object-cover"
                            />
                          ) : (
                            <div className="bg-primary p-6 md:p-8 flex flex-col items-center justify-center md:w-48 shrink-0">
                              <span className="text-primary-foreground text-sm font-medium">
                                {announcement.date.split(",")[0]}
                              </span>
                              <span className="text-primary-foreground/80 text-sm">
                                {announcement.time}
                              </span>
                            </div>
                          )}
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-display text-xl font-semibold text-foreground">
                                {announcement.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={categoryColors[announcement.category] || categoryColors.General}
                              >
                                {announcement.category}
                              </Badge>
                            </div>
                            {announcement.image_url && (
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  {announcement.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-primary" />
                                  {announcement.time}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 text-primary" />
                              {announcement.location}
                            </div>
                            <p className="text-sm text-muted-foreground">{announcement.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <div
                className={`text-center mt-12 transition-opacity duration-500 ${
                  upcomingAnimation.isVisible ? "opacity-100 animate-fade-in-up animation-delay-600" : "opacity-100"
                }`}
              >
                <Button asChild variant="outline" className="transition-all duration-300 hover:scale-105">
                  <Link to="/contact">
                    Contact us for more information
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default AnnouncementsPage;
