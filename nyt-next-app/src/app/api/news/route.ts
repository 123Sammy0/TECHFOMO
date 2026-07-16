import { NextResponse } from 'next/server';

const API_KEY = process.env.NEWS_API_KEY;

// Map filter names → NewsAPI search queries
const CATEGORY_QUERIES: Record<string, string> = {
  'ALL':          'technology OR startup OR software OR tech OR AI OR "Silicon Valley"',
  'AI & ML':      'artificial intelligence OR machine learning OR ChatGPT OR OpenAI OR Gemini OR LLM OR deep learning',
  'STARTUPS':     'startup funding OR venture capital OR Series A OR unicorn startup',
  'GADGETS':      'iPhone OR Samsung Galaxy OR laptop review OR smartwatch OR gadget review OR hardware',
  'CRYPTO':       'bitcoin OR ethereum OR cryptocurrency OR blockchain OR DeFi OR crypto market',
  'SPACE':        'SpaceX OR NASA OR rocket launch OR space mission OR satellite OR astronaut',
  'CYBERSECURITY':'cybersecurity OR data breach OR hacking OR ransomware OR malware OR vulnerability',
  'EVs':          'electric vehicle OR Tesla OR EV battery OR electric car OR Rivian OR Lucid Motors',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'ALL';
  const query = CATEGORY_QUERIES[category] || '';

  try {
    // We always use /everything sorted by publishedAt so the feed constantly updates with new articles
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) {
      throw new Error(`NewsAPI error: ${res.status}`);
    }

    const data = await res.json();
    const articles = (data.articles || []).filter(
      (a: any) => a.title && a.title !== '[Removed]' && a.url
    );

    return NextResponse.json({ articles, category, source: 'newsapi' });
  } catch (err) {
    console.error('News API proxy error:', err);
    return NextResponse.json(
      { articles: [], category, source: 'error', error: String(err) },
      { status: 500 }
    );
  }
}
