'use client';

import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import FinancialChart from './FinancialChart';
import ArticleLink from './ArticleLink';
import { CMSArticle } from '@/lib/cms-store';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80';

function safeHref(article: any): string {
  if (article?.id) return `/article/${encodeURIComponent(article.id)}`;
  return `https://www.google.com/search?q=${encodeURIComponent(article?.title || '')}&tbm=nws`;
}

function ArticleCard({ article, index, showNumber = false, className = '' }: {
  article: CMSArticle; index: number; showNumber?: boolean; className?: string;
}) {
  const href = safeHref(article);
  return (
    <article
      className={`feed-item${showNumber && index > 0 ? ' with-number' : ''}${article.isNew ? ' is-new' : ''} ${className}`.trim()}
      style={{ position: 'relative' }}
    >
      {article.isNew && <span className="new-tag">NEW</span>}
      {showNumber && index > 0 && <div className="bg-number">{index + 1}</div>}

      <ArticleLink article={article} className="card-link">
        <div className="feed-img">
          <img
            src={article.urlToImage || FALLBACK_IMG}
            alt={article.title}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
        </div>
        <h3 className="feed-headline">{article.title}</h3>
      </ArticleLink>

      <div className="meta">
        <span className="author">{article.author || article.source?.name || 'TECHFOMO'}</span>
        <span className="date" suppressHydrationWarning>
          {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </article>
  );
}

export function LeftNewsFeed({ articles }: { articles: CMSArticle[] }) {
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.col-left .feed-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { y: -4, duration: 0.25, ease: 'power2.out' });
        const img = item.querySelector<HTMLImageElement>('.feed-img img');
        if (img) gsap.to(img, { scale: 1.06, duration: 0.4, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { y: 0, duration: 0.25, ease: 'power2.out' });
        const img = item.querySelector<HTMLImageElement>('.feed-img img');
        if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });
  });

  return (
    <section className="col-left">
      <h2 className="section-title">LATEST TECH</h2>
      {articles.length === 0 ? (
        <p style={{ color: '#999', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif' }}>No articles match this filter.</p>
      ) : (
        articles.map((article, index) => (
          <ArticleCard key={article.id || index} article={article} index={index} showNumber />
        ))
      )}
    </section>
  );
}

export function RightNewsFeed({ articles }: { articles: CMSArticle[] }) {
  return (
    <section className="col-right">
      <FinancialChart />
      <h2 className="section-title">TRENDING</h2>
      {articles.length === 0 ? (
        <p style={{ color: '#999', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif' }}>No articles match this filter.</p>
      ) : (
        articles.map((article, index) => (
          <ArticleCard key={article.id || `right-${index}`} article={article} index={index} className="small" />
        ))
      )}
    </section>
  );
}
