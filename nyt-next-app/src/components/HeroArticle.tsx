'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Article } from '@/lib/api';

export default function HeroArticle({ article }: { article: Article & { isNew?: boolean; url?: string } }) {
  const containerRef = useRef<HTMLElement>(null);
  const href = article.url && article.url !== '#' ? article.url : undefined;

  useGSAP(() => {
    gsap.to('.hero-img', {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-article',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <article className="hero-article" ref={containerRef}>
      <div className="hero-text-content">
        {/* Headline + description wrapped in a link */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <h2 className="hero-headline" style={{ cursor: href ? 'pointer' : 'default' }}>
            {article.title}
          </h2>
          <p className="hero-deck" style={{ cursor: href ? 'pointer' : 'default' }}>
            {article.description}
          </p>
        </a>

        <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '30px' }}>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
            alt="Author"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <span className="author" style={{ display: 'block', fontSize: '0.85rem', color: '#000', textTransform: 'uppercase' }}>
              {article.author || article.source?.name}
            </span>
            <span className="date" style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }} suppressHydrationWarning>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Hero image also links to article */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-image-wrapper"
        style={{ cursor: href ? 'pointer' : 'default', display: 'block' }}
      >
        {article.urlToImage && (
          <img src={article.urlToImage} alt={article.title} className="hero-img" />
        )}
      </a>

      <div className="social-links">
        <span className="social-label">Share:</span>
        <svg viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      </div>
    </article>
  );
}
