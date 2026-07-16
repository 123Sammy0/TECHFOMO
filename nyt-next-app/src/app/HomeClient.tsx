'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Layout from '@/components/Layout';
import { LeftNewsFeed, RightNewsFeed } from '@/components/NewsFeeds';
import ArticleLink from '@/components/ArticleLink';
import { Article } from '@/lib/api';
import { useCMSFeed } from '@/hooks/useCMSFeed';
import { useFilter } from '@/lib/filter-context';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'AI & ML':       ['ai', 'artificial intelligence', 'machine learning', 'openai', 'gpt', 'llm', 'chatgpt', 'deepmind', 'neural', 'gemini', 'anthropic'],
  'STARTUPS':      ['startup', 'funding', 'series a', 'series b', 'venture', 'unicorn', 'seed', 'valuation', 'raised', 'investment'],
  'GADGETS':       ['gadget', 'iphone', 'apple', 'samsung', 'pixel', 'laptop', 'tablet', 'headphone', 'wearable', 'device', 'hardware', 'watch', 'camera'],
  'CRYPTO':        ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'defi', 'web3', 'token', 'binance', 'coinbase', 'solana'],
  'SPACE':         ['space', 'nasa', 'spacex', 'rocket', 'satellite', 'orbit', 'moon', 'mars', 'starship', 'launch', 'telescope'],
  'CYBERSECURITY': ['hack', 'security', 'breach', 'malware', 'ransomware', 'phishing', 'vulnerability', 'cyber', 'privacy', 'exploit'],
  'EVs':           ['electric vehicle', 'ev', 'tesla', 'electric car', 'battery', 'charging', 'rivian', 'lucid'],
};

// API now handles category filtering — this is just a safety passthrough
function filterArticles(articles: any[], _category: string): any[] {
  return articles.length > 0 ? articles : [];
}

// Route to internal article page — keeps users on TECHFOMO
function safeHref(article: any): string {
  if (article?.id) return `/article/${encodeURIComponent(article.id)}`;
  return `https://www.google.com/search?q=${encodeURIComponent(article?.title || '')}&tbm=nws`;
}

// Get article at index, cycling if needed so slots are never empty
function getAt(list: any[], index: number) {
  if (list.length === 0) return null;
  return list[index % list.length];
}

function FeatureCard({ article }: { article: any }) {
  return (
    <div className="feature-card">
      <ArticleLink article={article} className="feature-img-link">
        <img
          src={article.urlToImage || FALLBACK_IMG}
          alt={article.title}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
        />
      </ArticleLink>
      <div className="feature-text">
        <div className="feature-label">TOP STORY</div>
        <ArticleLink article={article} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2 className="feature-headline">{article.title}</h2>
        </ArticleLink>
        {article.description && <p className="feature-deck">{article.description}</p>}
        <div className="meta" style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span className="author">{(article.author || article.source?.name || 'TECHFOMO').toUpperCase()}</span>
          <span className="date" suppressHydrationWarning>
            {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

function GridCard({ article, idx }: { article: any; idx: number }) {
  return (
    <article className={`grid-item${article.isNew ? ' is-new' : ''}`} style={{ position: 'relative' }}>
      {article.isNew && <span className="new-tag">NEW</span>}
      <ArticleLink article={article} className="card-link">
        <div className="feed-img">
          <img
            src={article.urlToImage || FALLBACK_IMG}
            alt={article.title}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
            style={{ objectFit: 'cover', objectPosition: 'top', width: '100%', height: '100%', display: 'block' }}
          />
        </div>
        <h3 className="feed-headline">{article.title}</h3>
      </ArticleLink>
      <div className="meta">
        <span className="author">{(article.author || article.source?.name || 'TECHFOMO').toUpperCase()}</span>
        <span className="date" suppressHydrationWarning>
          {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </article>
  );
}

export default function HomeClient({ articles: serverArticles }: { articles: Article[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeFilter } = useFilter();
  const { articles, newCount, isLoading } = useCMSFeed(serverArticles, activeFilter);

  useGSAP(() => {
    const safe = (sel: string, vars: gsap.TweenVars) => {
      const els = document.querySelectorAll(sel);
      if (els.length) gsap.from(els, vars);
    };
    safe('.site-header', { y: -30, opacity: 0, duration: 0.7, ease: 'power3.out' });
    safe('.feature-card', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    safe('.col-left .feed-item', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: '.col-left', start: 'top 90%' }
    });
    safe('.col-right .feed-item', {
      x: 20, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out',
      scrollTrigger: { trigger: '.col-right', start: 'top 90%' }
    });
  });

  if (!articles || articles.length === 0) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '12px', fontFamily: 'Inter' }}>
          <div className="spinner" /><span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading TECHFOMO...</span>
        </div>
      </Layout>
    );
  }

  // Apply filter (falls back to all if too few matches)
  const filtered = filterArticles(articles, activeFilter);

  // Show filter loading bar
  const loadingBar = isLoading ? (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #2D9CDB 0%, #000 100%)', zIndex: 9999, animation: 'slide-in 0.8s ease forwards' }} />
  ) : null;

  // ── LOCKED LAYOUT SLOTS ──────────────────────────────────
  // Left:   4 articles (indices 1–4)
  // Center: feature(0) + split1(5,6) + promo(7) + split2(8,9)
  // Right:  5 articles (indices 10–14)
  // Indices cycle via getAt() so slots never go blank
  const feature   = getAt(filtered, 0)!;
  const leftList  = [1,2,3,4].map(i => getAt(filtered, i)!).filter(Boolean);
  const s1a       = getAt(filtered, 5)!;
  const s1b       = getAt(filtered, 6)!;
  const promo     = getAt(filtered, 7)!;
  const s2a       = getAt(filtered, 8)!;
  const s2b       = getAt(filtered, 9)!;
  const rightList = [10,11,12,13,14].map(i => getAt(filtered, i)!).filter(Boolean);

  return (
    <Layout>
      {loadingBar}
      {newCount > 0 && (
        <div className="new-badge-toast">
          🆕 {newCount} new article{newCount > 1 ? 's' : ''} added to the top
        </div>
      )}

      <div className="content-grid" ref={containerRef}>
        {/* ── LEFT COLUMN: 4 articles ── */}
        <LeftNewsFeed articles={leftList as any} />

        {/* ── CENTER COLUMN: locked slots ── */}
        <section className="col-center">
          <FeatureCard article={feature} />

          {/* Split row 1 — always 2 cards */}
          <div className="split-row">
            <GridCard article={s1a} idx={5} />
            <GridCard article={s1b} idx={6} />
          </div>

          {/* Promo / Featured article */}
          {promo && (() => {
            return (
              <ArticleLink article={promo} className="promo-banner" style={{ textDecoration: 'none', color: 'inherit' }}>
                {promo.urlToImage && (
                  <div className="promo-img">
                    <img
                      src={promo.urlToImage}
                      alt={promo.title}
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                  </div>
                )}
                <div className="promo-text">
                  <div className="feature-label">FEATURED</div>
                  <h3 className="promo-headline">{promo.title}</h3>
                  <div className="meta" style={{ marginTop: '8px' }}>
                    <span className="author">{(promo.author || promo.source?.name || 'TECHFOMO').toUpperCase()}</span>
                    <span className="date" suppressHydrationWarning>
                      {new Date(promo.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </ArticleLink>
            );
          })()}

          {/* Split row 2 — always 2 cards */}
          <div className="split-row">
            <GridCard article={s2a} idx={8} />
            <GridCard article={s2b} idx={9} />
          </div>
        </section>

        {/* ── RIGHT COLUMN: 5 articles ── */}
        <RightNewsFeed articles={rightList as any} />
      </div>
    </Layout>
  );
}
