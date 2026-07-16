import { Article } from './api';

const STORE_KEY = 'techfomo_cms_articles';
const MAX_ARTICLES = 100; // cap so localStorage doesn't overflow

export interface CMSArticle extends Article {
  id: string;         // unique key = url hash
  fetchedAt: number;  // timestamp
  isNew?: boolean;    // badge flag
}

function hashUrl(url: string): string {
  // Simple deterministic hash from URL
  let h = 0;
  for (let i = 0; i < url.length; i++) {
    h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

export function loadStore(): CMSArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStore(articles: CMSArticle[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(articles.slice(0, MAX_ARTICLES)));
  } catch {
    // Storage full — trim and retry
    localStorage.setItem(STORE_KEY, JSON.stringify(articles.slice(0, 30)));
  }
}

/**
 * Merge incoming API articles with the existing store.
 * New articles are prepended (newest first).
 * Existing articles are never removed or reordered.
 * Returns { merged: CMSArticle[], newCount: number }
 */
export function mergeArticles(
  existing: CMSArticle[],
  incoming: Article[]
): { merged: CMSArticle[]; newCount: number } {
  const existingIds = new Set(existing.map(a => a.id));
  const now = Date.now();

  const fresh: CMSArticle[] = incoming
    .filter(a => a.title && a.url)
    .map(a => ({
      ...a,
      id: hashUrl(a.url),
      fetchedAt: now,
      isNew: true,
    }))
    .filter(a => !existingIds.has(a.id)); // deduplicate

  if (fresh.length === 0) {
    return { merged: existing, newCount: 0 };
  }

  // Strip isNew from existing after 5 minutes
  const updated = existing.map(a => ({
    ...a,
    isNew: a.isNew && (now - a.fetchedAt < 5 * 60 * 1000),
  }));

  return {
    merged: [...fresh, ...updated],
    newCount: fresh.length,
  };
}
