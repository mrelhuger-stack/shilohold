import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  link: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channelId } = await req.json();
    
    if (!channelId) {
      return new Response(
        JSON.stringify({ error: "Channel ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the YouTube RSS feed
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch YouTube feed: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse the XML feed
    const videos: YouTubeVideo[] = [];
    
    // Extract entries using regex (simple XML parsing for Deno)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entry = match[1];
      
      // Extract video ID
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "";
      
      // Extract title
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : "";
      
      // Extract published date
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const publishedAt = publishedMatch ? publishedMatch[1] : "";
      
      // Extract description from media:group
      const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
      const description = descMatch ? descMatch[1] : "";
      
      // Extract thumbnail
      const thumbMatch = entry.match(/<media:thumbnail url="([^"]+)"/);
      const thumbnail = thumbMatch ? thumbMatch[1] : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      if (videoId) {
        videos.push({
          id: videoId,
          title: decodeHTMLEntities(title),
          description: decodeHTMLEntities(description),
          publishedAt,
          thumbnail,
          link: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    return new Response(
      JSON.stringify({ videos, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching YouTube feed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
