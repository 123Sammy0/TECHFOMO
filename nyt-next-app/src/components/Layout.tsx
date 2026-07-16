'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useFilter } from '@/lib/filter-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const [weather, setWeather] = useState<string>('...');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { activeFilter, setActiveFilter } = useFilter();

  const filters = ['ALL', 'AI & ML', 'STARTUPS', 'GADGETS', 'CRYPTO', 'SPACE', 'CYBERSECURITY', 'EVs'];

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data?.current_weather) {
          const f = (data.current_weather.temperature * 9 / 5) + 32;
          setWeather(`${Math.round(f)}°F`);
        }
      })
      .catch(() => setWeather('72°F'));
  }, []);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Animate search modal
  useEffect(() => {
    const el = searchModalRef.current;
    if (!el) return;
    if (searchOpen) {
      gsap.fromTo(el, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', display: 'flex' });
    } else {
      gsap.to(el, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', onComplete: () => { el.style.display = 'none'; } });
    }
  }, [searchOpen]);

  useGSAP(() => {
    if (hamburgerRef.current) {
      hamburgerRef.current.addEventListener('mousemove', (e) => {
        const rect = hamburgerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(hamburgerRef.current, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
      });
      hamburgerRef.current.addEventListener('mouseleave', () => {
        gsap.to(hamburgerRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      });
    }
  });

  const openMenu = () => { if (overlayRef.current) overlayRef.current.classList.add('active'); };
  const closeMenu = () => { if (overlayRef.current) overlayRef.current.classList.remove('active'); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' tech news')}`, '_blank');
    }
  };

  return (
    <>
      {/* Menu Overlay */}
      <div className="menu-overlay" ref={overlayRef}>
        <div className="close-menu" onClick={closeMenu}>✕</div>
        <nav className="overlay-nav">
          {filters.filter(f => f !== 'ALL').map(f => (
            <a key={f} href="#" onClick={(e) => { e.preventDefault(); setActiveFilter(f); closeMenu(); }}>{f}</a>
          ))}
        </nav>
      </div>

      {/* Search Modal */}
      <div ref={searchModalRef} className="search-modal" style={{ display: 'none' }}>
        <div className="search-backdrop" onClick={() => setSearchOpen(false)} />
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              autoFocus
              type="text"
              placeholder="Search tech news…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
          <p className="search-hint">Press Enter to search · Esc to close</p>
        </div>
      </div>

      {/* Fixed Sidebar — slimmer */}
      <aside className="left-sidebar">
        {/* Hamburger */}
        <button className="sidebar-btn" ref={hamburgerRef} onClick={openMenu} title="Menu" aria-label="Open menu">
          <span /><span /><span />
        </button>

        {/* Search */}
        <button className="sidebar-btn search-btn" onClick={() => setSearchOpen(true)} title="Search" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Divider dots */}
        <div className="sidebar-divider" />

        {/* Category filters */}
        <div className="sidebar-filters">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-dot${activeFilter === f ? ' active' : ''}`}
              title={f}
              onClick={() => setActiveFilter(f)}
              aria-label={`Filter: ${f}`}
            >
              <span className="filter-tooltip">{f}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-divider" />

        {/* Live weather */}
        <a href="https://weather.com" target="_blank" rel="noopener noreferrer" className="sidebar-weather" title="Weather forecast">
          <svg className="weather-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D9CDB" strokeWidth="2">
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.0147 19.9853 10 17.5 10C17.0601 10 16.635 10.0631 16.2307 10.1812C15.5393 7.23467 12.9234 5 9.75 5C6.02208 5 3 8.02208 3 11.75C3 12.3965 3.09139 13.0213 3.26257 13.6121C1.94276 14.3642 1 15.8014 1 17.5C1 20.5376 3.46243 23 6.5 23L17.5 23C19.7091 23 21.5 21.2091 21.5 19Z" fill="#2D9CDB" fillOpacity="0.15" />
          </svg>
          <div className="weather-temp">{weather}</div>
        </a>
      </aside>

      <main className="main-wrapper">
        {/* Filter bar under top nav */}
        <nav className="top-nav">
          <div className="filter-pills">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-pill${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="search-pill" onClick={() => setSearchOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            SEARCH
          </button>
        </nav>

        <header className="site-header">
          <h1 className="logo">TECHFOMO</h1>
        </header>

        {children}

        <footer className="site-footer">
          <div className="footer-top">
            <h2 className="footer-logo">TECHFOMO</h2>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} TECHFOMO Media LLC. All rights reserved.</p>
            <p>Powered by NewsAPI.org</p>
          </div>
        </footer>
      </main>
    </>
  );
}
