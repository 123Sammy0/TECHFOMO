'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { CMSArticle, loadStore, saveStore, mergeArticles } from '@/lib/cms-store';
import { fallbackArticles } from '@/lib/api';

const POLL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes for background refresh
const STORE_KEY_PREFIX = 'techfomo_cms_';

function storeKey(category: string) {
  return STORE_KEY_PREFIX + category.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function seedFromFallback(): CMSArticle[] {
  const now = Date.now();
  return fallbackArticles.map((a, i) => ({
    ...a,
    id: `seed_${i}_${a.url.slice(-8)}`,
    fetchedAt: now - i * 1000,
    isNew: false,
  }));
}

function loadCategoryStore(category: string): CMSArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storeKey(category));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCategoryStore(category: string, articles: CMSArticle[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storeKey(category), JSON.stringify(articles.slice(0, 50)));
  } catch { /* storage full */ }
}

export function useCMSFeed(
  serverArticles: import('@/lib/api').Article[],
  activeFilter: string = 'ALL'
) {
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);
  const currentFilter = useRef(activeFilter);

  // Animate new cards sliding in
  const animateNewIn = useCallback((count: number) => {
    if (count === 0) return;
    setTimeout(() => {
      const items = document.querySelectorAll('.feed-item.is-new');
      if (items.length) gsap.from(items, { y: -40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }, 80);
  }, []);

  // Fetch articles for a given category from our proxy
  const fetchCategory = useCallback(async (category: string): Promise<CMSArticle[]> => {
    const res = await fetch(`/api/news?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const incoming = data.articles || [];

    const existing = loadCategoryStore(category);
    const now = Date.now();

    if (existing.length === 0) {
      // First load: use all incoming as initial store
      const initial: CMSArticle[] = incoming.map((a: any, i: number) => ({
        ...a,
        id: `${category}_${i}_${a.url?.slice(-10) || i}`,
        fetchedAt: now - i * 100,
        isNew: false,
      }));
      saveCategoryStore(category, initial);
      return initial;
    }

    // Subsequent loads: merge and push new to top
    const { merged, newCount } = mergeArticles(existing, incoming);
    if (newCount > 0) {
      saveCategoryStore(category, merged);
      setNewCount(newCount);
      animateNewIn(newCount);
      setTimeout(() => setNewCount(0), 5000);
    }
    return merged;
  }, [animateNewIn]);

  // Switch category — load from cache first, then fetch fresh
  useEffect(() => {
    currentFilter.current = activeFilter;

    // Clear poll timer on filter switch
    if (pollTimer.current) clearInterval(pollTimer.current);

    // 1. Load cached articles immediately (instant render)
    const cached = loadCategoryStore(activeFilter);
    if (cached.length > 0) {
      setArticles(cached);
    } else if (activeFilter === 'ALL') {
      // Seed with server articles on first ALL load
      const seed = serverArticles.length > 0 ? serverArticles : fallbackArticles;
      const seedCMS = seed.map((a, i) => ({
        ...a,
        id: `seed_${i}`,
        fetchedAt: Date.now() - i * 100,
        isNew: false,
      }));
      setArticles(seedCMS);
      saveCategoryStore('ALL', seedCMS);
    }

    // 2. Fetch fresh in background
    setIsLoading(true);
    fetchCategory(activeFilter)
      .then(fresh => {
        // Only update if we're still on the same filter
        if (currentFilter.current === activeFilter) {
          setArticles(fresh);
        }
      })
      .catch(err => console.warn(`[TECHFOMO] Fetch failed for ${activeFilter}:`, err))
      .finally(() => setIsLoading(false));

    // 3. Set up background poll every 30min
    pollTimer.current = setInterval(() => {
      fetchCategory(activeFilter)
        .then(fresh => {
          if (currentFilter.current === activeFilter) setArticles(fresh);
        })
        .catch(() => {});
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [activeFilter, fetchCategory, serverArticles]);

  return { articles, newCount, isLoading };
}
