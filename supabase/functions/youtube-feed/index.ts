import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

    let videos: YouTubeVideo[] = [];

    // Try RSS feed first
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    try {
      const response = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ChurchWebsite/1.0)" },
      });

      if (response.ok) {
        const xmlText = await response.text();
        videos = parseRSSFeed(xmlText);
      } else {
        console.log(`RSS feed returned ${response.status}, trying channel page scrape...`);
      }
    } catch (e) {
      console.log("RSS feed failed, trying channel page scrape...", e);
    }

    // Fallback: scrape the channel page for video IDs
    if (videos.length === 0) {
      // Try both /streams and /videos tabs
      const tabs = ["/streams", "/videos"];
      for (const tab of tabs) {
        try {
          const channelUrl = `https://www.youtube.com/channel/${channelId}${tab}`;
          const pageResponse = await fetch(channelUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9",
            },
          });

          if (pageResponse.ok) {
            const html = await pageResponse.text();
            const tabVideos = parseChannelPage(html);
            // Add unique videos
            for (const v of tabVideos) {
              if (!videos.some(existing => existing.id === v.id)) {
                videos.push(v);
              }
            }
          }
        } catch (e) {
          console.error(`Channel ${tab} tab scrape failed:`, e);
        }
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
      JSON.stringify({ error: errorMessage, videos: [], fetchedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function parseRSSFeed(xmlText: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entry = match[1];
    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const videoId = videoIdMatch ? videoIdMatch[1] : "";
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";
    const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
    const publishedAt = publishedMatch ? publishedMatch[1] : "";
    const descMatch = entry.match(/<media:description>([^<]*)<\/media:description>/);
    const description = descMatch ? descMatch[1] : "";
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
  return videos;
}

function parseChannelPage(html: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const seen = new Set<string>();

  // Extract video data from the initial page data (ytInitialData)
  const dataMatch = html.match(/var ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s);
  if (dataMatch) {
    try {
      const data = JSON.parse(dataMatch[1]);
      const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
      for (const tab of tabs) {
        const content = tab?.tabRenderer?.content;
        const items = content?.richGridRenderer?.contents || [];
        for (const item of items) {
          const renderer = item?.richItemRenderer?.content?.videoRenderer;
          if (renderer?.videoId && !seen.has(renderer.videoId)) {
            seen.add(renderer.videoId);
            const videoId = renderer.videoId;
            videos.push({
              id: videoId,
              title: renderer.title?.runs?.[0]?.text || "Untitled",
              description: renderer.descriptionSnippet?.runs?.map((r: { text: string }) => r.text).join("") || "",
              publishedAt: renderer.publishedTimeText?.simpleText || "",
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              link: `https://www.youtube.com/watch?v=${videoId}`,
            });
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse ytInitialData:", e);
    }
  }

  // Fallback: extract video IDs from the HTML with regex
  if (videos.length === 0) {
    const videoIdRegex = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
    let m;
    while ((m = videoIdRegex.exec(html)) !== null && videos.length < 15) {
      const videoId = m[1];
      if (!seen.has(videoId)) {
        seen.add(videoId);
        videos.push({
          id: videoId,
          title: "",
          description: "",
          publishedAt: "",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          link: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }
  }

  return videos;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}
