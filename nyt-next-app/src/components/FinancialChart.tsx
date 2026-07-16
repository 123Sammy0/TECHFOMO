'use client';

import React, { useState, useEffect } from 'react';

// Filter keywords per category
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'AI & ML':        ['ai', 'artificial intelligence', 'machine learning', 'openai', 'gpt', 'llm', 'chatgpt', 'deepmind', 'google ai', 'ml', 'neural'],
  'STARTUPS':       ['startup', 'funding', 'series a', 'series b', 'vc', 'venture', 'unicorn', 'seed', 'valuation', 'raised'],
  'GADGETS':        ['gadget', 'iphone', 'apple', 'samsung', 'pixel', 'laptop', 'tablet', 'headphone', 'wearable', 'device', 'hardware', 'review'],
  'CRYPTO':         ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'defi', 'web3', 'token', 'binance', 'coinbase'],
  'SPACE':          ['space', 'nasa', 'spacex', 'rocket', 'satellite', 'orbit', 'moon', 'mars', 'starship', 'launch'],
  'CYBERSECURITY':  ['hack', 'security', 'breach', 'malware', 'ransomware', 'phishing', 'vulnerability', 'cyber', 'privacy'],
  'EVs':            ['electric vehicle', 'ev', 'tesla', 'electric car', 'battery', 'charging', 'rivian', 'lucid', 'ford ev'],
};

// Animated SVG sparkline chart
function Sparkline({ color = '#2D9CDB' }: { color?: string }) {
  const points = [20, 45, 30, 60, 50, 70, 55, 80, 65, 75];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const h = 50;
  const w = 200;
  const step = w / (points.length - 1);
  const ys = points.map(p => h - ((p - min) / (max - min)) * (h - 10) - 5);
  const d = ys.map((y, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${y}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dashoffset" from="500" to="0" dur="2s" fill="freeze" />
      </path>
    </svg>
  );
}

interface Ticker {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
}

const DEFAULT_TICKERS: Ticker[] = [
  { symbol: 'NVDA', name: 'NVIDIA', price: '131.38', change: '+2.4%', up: true },
  { symbol: 'AAPL', name: 'Apple', price: '214.50', change: '-0.3%', up: false },
  { symbol: 'MSFT', name: 'Microsoft', price: '445.20', change: '+1.1%', up: true },
  { symbol: 'TSLA', name: 'Tesla', price: '248.90', change: '+3.2%', up: true },
];

export default function FinancialChart() {
  const [tickers, setTickers] = useState<Ticker[]>(DEFAULT_TICKERS);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Simulate live price fluctuations every 10s
    const tick = () => {
      setTickers(prev => prev.map(t => {
        const delta = (Math.random() - 0.48) * 2;
        const newPrice = (parseFloat(t.price) + delta).toFixed(2);
        const pct = ((delta / parseFloat(t.price)) * 100).toFixed(2);
        const up = delta >= 0;
        return { ...t, price: newPrice, change: `${up ? '+' : ''}${pct}%`, up };
      }));
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    tick(); // immediate
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="financial-chart" style={{ marginBottom: '40px', background: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #EEE' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#111' }}>Market Overview</h3>
        {lastUpdated && <span style={{ fontSize: '0.6rem', color: '#aaa' }}>Live · {lastUpdated}</span>}
      </div>
      <div style={{ overflowX: 'auto', display: 'flex', gap: '10px', paddingBottom: '4px' }}>
        {tickers.map(t => (
          <div key={t.symbol} style={{ minWidth: '70px', padding: '8px 10px', background: t.up ? 'rgba(0,200,100,0.05)' : 'rgba(220,60,60,0.05)', borderRadius: '8px', border: `1px solid ${t.up ? 'rgba(0,180,80,0.15)' : 'rgba(220,60,60,0.15)'}` }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', marginBottom: '2px' }}>{t.symbol}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>${t.price}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: t.up ? '#22c55e' : '#ef4444' }}>{t.change}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px' }}>
        <Sparkline color="#2D9CDB" />
      </div>
    </div>
  );
}
