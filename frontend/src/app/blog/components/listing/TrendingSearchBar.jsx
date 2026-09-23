'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { searchBlogs } from '@/api/frontend/blog';

// Inline type-ahead over ALL active blogs — stays on /blog (no dedicated search
// page/URL). Each (debounced) keystroke hits the backend /blog/search endpoint,
// which queries the full published collection in MongoDB and returns slim
// results — replacing the old approach of downloading every post (full rich-text
// bodies, multiple MB) into the browser and filtering client-side.
export default function TrendingSearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const rootRef = useRef(null);
  const debounceRef = useRef(null);
  // Monotonic id so a slow earlier response can never overwrite a newer one.
  const requestSeqRef = useRef(0);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const runSearch = (value) => {
    const q = value.trim();
    clearTimeout(debounceRef.current);
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const seq = ++requestSeqRef.current;
      const data = await searchBlogs(q, 6);
      if (seq !== requestSeqRef.current) return; // stale response — ignore
      setResults(data);
      setLoading(false);
    }, 300);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setOpen(value.trim().length > 0);
    runSearch(value);
  };

  const handleFocus = () => {
    if (query.trim().length > 0) setOpen(true);
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-[180px] shrink-0 sm:max-w-[240px] lg:max-w-[280px]">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
      />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Search blogs..."
        aria-label="Search blogs"
        className="w-full rounded-full border border-[#E8ECF4] bg-[#F8F9FC] py-2 pl-9 pr-8 text-[13px] text-[#1D1F4B] placeholder:text-[#94A3B8] outline-none transition-colors focus:border-[#7185FA] focus:bg-white sm:text-[14px]"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); setOpen(false); setResults([]); setLoading(false); clearTimeout(debounceRef.current); }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5566DC]"
        >
          <X size={14} />
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[min(90vw,360px)] overflow-hidden rounded-[12px] border border-[#E8ECF4] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
          {loading ? (
            <div className="px-4 py-4 text-[13px] text-[#64748B]">Searching…</div>
          ) : results.length > 0 ? (
            <ul className="max-h-[320px] overflow-y-auto py-1.5">
              {results.map((post) => (
                <li key={post._id || post.slug}>
                  <Link
                    href={`/blog/${post.slug || post._id}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 transition-colors hover:bg-[#F8F9FC]"
                  >
                    <div className="line-clamp-1 text-[13px] font-medium text-[#1D1F4B] sm:text-[14px]">
                      {post.title}
                    </div>
                    {post.blogcategory?.title && (
                      <div className="mt-0.5 text-[11px] font-semibold text-[#5566DC] sm:text-[12px]">
                        {post.blogcategory.title}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-4 text-[13px] text-[#64748B]">
              No blogs found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
