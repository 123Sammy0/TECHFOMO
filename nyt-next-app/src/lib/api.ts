export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  source: { name: string };
}

// Fallback data in case the API key is invalid or rate limited
export const fallbackArticles: Article[] = [
  {
    title: "Mark Zuckerberg: Cuba 'something we might consider'",
    description: "Facebook CEO Mark Zuckerberg visits the Summit of the Americas, remaining quiet on plans to expand into a changing Cuba.",
    url: "#",
    urlToImage: "/assets/images/hero_ceo.png",
    publishedAt: "2026-07-16T10:00:00Z",
    author: "ELLEN BARRY",
    source: { name: "TechFomo" }
  },
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Capabilities",
    description: "The next generation of AI is here, offering unprecedented reasoning and efficiency.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=80",
    publishedAt: "2026-07-15T10:00:00Z",
    author: "SAM ALTMAN",
    source: { name: "AI Insider" }
  },
  {
    title: "Apple Vision Pro 2 Rumored for Q4 Release",
    description: "Lighter, cheaper, and with better battery life, the next iteration is highly anticipated.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80",
    publishedAt: "2026-07-14T10:00:00Z",
    author: "TIM COOK",
    source: { name: "Tech Crunch" }
  },
  {
    title: "SpaceX Starship Successfully Docks with ISS",
    description: "A monumental achievement for commercial spaceflight as Starship proves its orbital capabilities.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500&q=80",
    publishedAt: "2026-07-13T10:00:00Z",
    author: "ELON MUSK",
    source: { name: "Space Daily" }
  },
  {
    title: "Quantum Computing Breakthrough at MIT",
    description: "Researchers achieve room-temperature quantum coherence for a record-breaking 5 seconds.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80",
    publishedAt: "2026-07-12T10:00:00Z",
    author: "MIT News",
    source: { name: "Science Today" }
  },
  {
    title: "NVIDIA Stock Surges After New AI Chip Unveiled",
    description: "The Blackwell architecture promises a 30x performance boost in LLM inference.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1591280063444-d3c514eb6e13?w=500&q=80",
    publishedAt: "2026-07-11T10:00:00Z",
    author: "MARKET WATCH",
    source: { name: "Financial Times" }
  },
  {
    title: "Tesla Cybertruck Firmware Update Adds Hover Mode",
    description: "Just kidding, but the new update does significantly improve autonomous navigation.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    publishedAt: "2026-07-10T10:00:00Z",
    author: "AUTO BLOG",
    source: { name: "TechFomo" }
  },
  {
    title: "Google's New Search Algorithm Prioritizes Human Writers",
    description: "A major shift to combat AI-generated SEO spam takes effect today.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&q=80",
    publishedAt: "2026-07-09T10:00:00Z",
    author: "SUNDAR PICHAI",
    source: { name: "Search Engine Land" }
  },
  {
    title: "Cyberpunk 2077 Gets Surprise VR Update",
    description: "CD Projekt Red delivers a breathtaking virtual reality experience free for all owners.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    publishedAt: "2026-07-08T10:00:00Z",
    author: "GAMER NETWORK",
    source: { name: "Polygon" }
  },
  {
    title: "Bitcoin Reaches New All-Time High Amid Institutional FOMO",
    description: "Cryptocurrency markets rally as major banks announce integrated custody solutions.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&q=80",
    publishedAt: "2026-07-07T10:00:00Z",
    author: "CRYPTO INSIDER",
    source: { name: "CoinDesk" }
  },
  {
    title: "Spotify Introduces Hi-Fi Lossless Audio Tier",
    description: "After years of rumors, the music streaming giant finally delivers audiophile quality.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80",
    publishedAt: "2026-07-06T10:00:00Z",
    author: "MUSIC TECH",
    source: { name: "The Verge" }
  },
  {
    title: "Amazon Prime Air Drone Delivery Expands to 50 Cities",
    description: "The long-awaited drone delivery service is finally rolling out nationwide.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&q=80",
    publishedAt: "2026-07-05T10:00:00Z",
    author: "JEFF BEZOS",
    source: { name: "TechFomo" }
  },
  {
    title: "Netflix Games Now Includes AAA Titles",
    description: "The streaming company doubles down on gaming, adding blockbusters to its catalog.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b7738?w=500&q=80",
    publishedAt: "2026-07-04T10:00:00Z",
    author: "REED HASTINGS",
    source: { name: "Variety" }
  }
];

export async function getTopNews(): Promise<Article[]> {
  const API_KEY = process.env.NEWS_API_KEY;
  
  try {
    // Try NewsAPI first
    const res = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEY}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.articles && data.articles.length >= 10) {
        return data.articles.filter((a: any) => a.title && a.urlToImage);
      }
    }
  } catch (e) {
    console.error("API Fetch Error:", e);
  }

  // If the API key is missing a char or invalid (401), fallback to our robust dummy data
  return fallbackArticles;
}
