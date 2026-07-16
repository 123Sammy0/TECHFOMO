'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ArticleLinkProps {
  article: any;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Saves article to sessionStorage on click, then navigates to /article/[id].
 * This guarantees the article page always finds the data — no race condition.
 */
export default function ArticleLink({ article, className, style, children }: ArticleLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!article?.id) return;
    try {
      // Save to sessionStorage — always available on article page
      sessionStorage.setItem(`techfomo_article_${article.id}`, JSON.stringify(article));
    } catch { /* storage full */ }
    router.push(`/article/${encodeURIComponent(article.id)}`);
  };

  return (
    <a
      href={`/article/${encodeURIComponent(article?.id || '')}`}
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
