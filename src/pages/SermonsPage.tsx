import Layout from "@/components/layout/Layout";
import { Play, Calendar, User, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ============================================
// SERMONS DATA - EASY TO EDIT
// Add new sermons by adding objects to this array
// videoUrl can be YouTube, Vimeo, or other embed URLs
// ============================================
const sermons = [
  {
    title: "Walking in Faith",
    speaker: "Pastor George Patterson",
    date: "January 26, 2026",
    series: "New Year, New Faith",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Discover how to strengthen your walk with God as we begin a new year filled with His promises.",
  },
  {
    title: "The Power of Prayer",
    speaker: "Pastor George Patterson",
    date: "January 19, 2026",
    series: "New Year, New Faith",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Learn the transformative power of consistent, heartfelt prayer in your daily life.",
  },
  {
    title: "Building Strong Foundations",
    speaker: "Pastor George Patterson",
    date: "January 12, 2026",
    series: "New Year, New Faith",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Jesus teaches us to build our lives on the solid rock of His Word.",
  },
  {
    title: "The Gift of Grace",
    speaker: "Pastor George Patterson",
    date: "December 29, 2025",
    series: "Christmas Messages",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Reflecting on the ultimate gift of God's grace given to us through Jesus Christ.",
  },
  {
    title: "Joy to the World",
    speaker: "Pastor George Patterson",
    date: "December 22, 2025",
    series: "Christmas Messages",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Celebrating the joy that comes from knowing our Savior was born to bring us hope.",
  },
];

const seriesList = [...new Set(sermons.map((s) => s.series))];
const speakerList = [...new Set(sermons.map((s) => s.speaker))];

const SermonsPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
            Sermons
          </h1>
          <p className="text-secondary-foreground/80 text-lg max-w-2xl mx-auto">
            Watch or listen to recent messages from our worship services. Be encouraged and grow in your faith.
          </p>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Latest Message</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Sermon
            </h2>
            <div className="section-divider" />
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-border">
              <div className="aspect-video">
                <iframe
                  src={sermons[0].videoUrl}
                  title={sermons[0].title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {sermons[0].title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-primary" />
                    {sermons[0].speaker}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    {sermons[0].date}
                  </span>
                </div>
                <p className="text-muted-foreground">{sermons[0].description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sermon Archive */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">More Messages</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sermon Archive
            </h2>
            <div className="section-divider" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Series</SelectItem>
                {seriesList.map((series) => (
                  <SelectItem key={series} value={series}>{series}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Speaker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Speakers</SelectItem>
                {speakerList.map((speaker) => (
                  <SelectItem key={speaker} value={speaker}>{speaker}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sermon Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sermons.slice(1).map((sermon, index) => (
              <Card key={index} className="card-hover bg-card border-border overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs text-primary font-medium mb-1">{sermon.series}</p>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {sermon.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {sermon.speaker}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {sermon.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* YouTube Link */}
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <a
                href="https://www.youtube.com/@shiloholdsitebaptistchurch3089"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch more on YouTube
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SermonsPage;
