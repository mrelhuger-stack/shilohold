import Layout from "@/components/layout/Layout";
import { Play, Calendar, User, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  link: string;
}

// Church's YouTube channel ID
const YOUTUBE_CHANNEL_ID = "UCqVzwMwYk5fV6_7R3B892wg";

const SermonsPage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const { toast } = useToast();

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("youtube-feed", {
        body: { channelId: YOUTUBE_CHANNEL_ID },
      });

      if (error) throw error;

      if (data?.videos) {
        setVideos(data.videos);
        setLastFetched(data.fetchedAt);
        if (data.videos.length > 0 && !selectedVideo) {
          setSelectedVideo(data.videos[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load sermons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, selectedVideo]);

  useEffect(() => {
    fetchVideos();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-10 md:py-14 bg-secondary">
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
            <Button
              variant="outline"
              size="sm"
              onClick={fetchVideos}
              disabled={isLoading}
              className="mt-4"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {isLoading && videos.length === 0 ? (
            <div className="max-w-4xl mx-auto text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading sermons...</p>
            </div>
          ) : selectedVideo ? (
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden border-border">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    {selectedVideo.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(selectedVideo.publishedAt)}
                    </span>
                  </div>
                  {selectedVideo.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {selectedVideo.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto text-center py-12">
              <p className="text-muted-foreground">No sermons available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sermon Archive */}
      {videos.length > 1 && (
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium mb-2">More Messages</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Sermon Archive
              </h2>
              <div className="section-divider" />
            </div>

            {/* Sermon Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {videos.slice(1).map((video) => (
                <Card
                  key={video.id}
                  className="card-hover bg-card border-border overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="aspect-video relative bg-muted">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(video.publishedAt)}
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
      )}

      {/* Last Updated */}
      {lastFetched && (
        <div className="text-center py-4 bg-background">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(lastFetched).toLocaleString()}
          </p>
        </div>
      )}
    </Layout>
  );
};

export default SermonsPage;
