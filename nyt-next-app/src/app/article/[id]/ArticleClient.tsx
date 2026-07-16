'use client';

import React, { useEffect, useState } from 'react';
import { CMSArticle } from '@/lib/cms-store';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80';

function loadArticleById(id: string): CMSArticle | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Check sessionStorage first — always fresh, saved on click
    const session = sessionStorage.getItem(`techfomo_article_${id}`);
    if (session) return JSON.parse(session);

    // 2. Fall back to searching all localStorage category stores
    const keys = Object.keys(localStorage).filter(k => k.startsWith('techfomo_cms_'));
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const articles: CMSArticle[] = JSON.parse(raw);
      const found = articles.find(a => a.id === id);
      if (found) return found;
    }
    return null;
  } catch {
    return null;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ArticleClient({ id }: { id: string }) {
  const [article, setArticle] = useState<CMSArticle | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = loadArticleById(id);
    if (found) {
      setArticle(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', gap: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Article not found</h1>
        <p style={{ color: '#888' }}>This article may have expired from your local cache.</p>
        <a href="/" style={{ background: '#000', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>← Back to TECHFOMO</a>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const externalUrl = article.url && article.url !== '#' ? article.url : null;

  return (
    <div className="article-page">
      {/* Top bar */}
      <nav className="article-topbar">
        <a href="/" className="article-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          TECHFOMO
        </a>
        <div className="article-source-badge">
          {article.source?.name || 'News'}
        </div>
      </nav>

      {/* Hero image */}
      <div className="article-hero-img">
        <img
          src={article.urlToImage || FALLBACK_IMG}
          alt={article.title}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
        <div className="article-hero-overlay" />
      </div>

      {/* Article content */}
      <div className="article-content">
        {/* Category tag */}
        {article.isNew && (
          <span className="article-new-tag">🆕 JUST IN</span>
        )}

        {/* Headline */}
        <h1 className="article-headline">{article.title}</h1>

        {/* Meta */}
        <div className="article-meta">
          <div className="article-author-block">
            <div className="article-author-avatar">
              {(article.author || article.source?.name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="article-author-name">{article.author || article.source?.name || 'TECHFOMO Staff'}</div>
              <div className="article-author-date">
                {new Date(article.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
                {timeAgo(article.publishedAt)}
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="article-share">
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href }) || window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="article-share-btn"
              title="Share"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
              className="article-share-btn"
              title="Copy link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="article-divider" />

        {/* Description / summary */}
        {article.description && (
          <p className="article-description">{article.description}</p>
        )}

        {/* Truncated content from NewsAPI */}
        {(article as any).content && (article as any).content !== '[Removed]' && (
          <div className="article-body">
            <p>{(article as any).content.replace(/\[\+\d+ chars\]$/, '')}</p>
          </div>
        )}

        {/* Divider before CTA */}
        <div className="article-divider" />

        {/* READ FULL ARTICLE CTA */}
        <div className="article-cta">
          <div className="article-cta-text">
            <div className="article-cta-label">CONTINUE READING</div>
            <p className="article-cta-sub">Full story available at <strong>{article.source?.name || 'the original source'}</strong></p>
          </div>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-read-btn"
            >
              Read Full Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ) : (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(article.title)}&tbm=nws`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-read-btn"
            >
              Search This Story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="article-footer">
        <a href="/" className="article-footer-logo">TECHFOMO</a>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>© {new Date().getFullYear()} TECHFOMO Media LLC</p>
      </footer>
    </div>
  );
}
