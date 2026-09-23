'use client'

import { useEffect } from 'react';
import { FiX, FiCalendar, FiUser } from 'react-icons/fi';

export default function BlogPreviewModal({ isOpen, onClose, data }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10, 10, 30, 0.75)',
      backdropFilter: 'blur(6px)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Preview topbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#474972',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: '#fff', color: '#474972',
            borderRadius: 4, padding: '2px 8px',
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
          }}>PREVIEW</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            This is exactly how your blog will appear on the website
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, padding: '6px 14px',
            color: '#fff', cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
          }}
        >
          <FiX size={14} /> Close
        </button>
      </div>

      {/* Simulated browser bar */}
      <div style={{
        background: '#f1f3f4', borderBottom: '1px solid #dadce0',
        padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#ffbd2e','#28c840'].map(c => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: '#fff', border: '1px solid #dadce0',
          borderRadius: 20, padding: '4px 14px',
          fontSize: 12, color: '#888', maxWidth: 480,
        }}>
          yourdomain.com/blog/{data.slug || 'blog-slug'}
        </div>
      </div>

      {/* Actual blog page simulation */}
      <div style={{ background: '#fff', flex: 1 }}>

        {/* Hero image */}
        {data.imageUrl ? (
          <div style={{ width: '100%', maxHeight: 480, overflow: 'hidden', background: '#f0f0f8' }}>
            <img
              src={data.imageUrl}
              alt={data.title || 'Blog image'}
              style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
            />
          </div>
        ) : (
          <div style={{
            width: '100%', height: 220,
            background: 'linear-gradient(135deg, #edeafd 0%, #d8d5f7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9a9bb8', fontSize: 14, fontStyle: 'italic',
          }}>
            No featured image uploaded
          </div>
        )}

        {/* Article content */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 100px' }}>

          {/* Category badge */}
          {data.category && (
            <div style={{ marginBottom: 20 }}>
              <span style={{
                background: '#474972', color: '#fff',
                borderRadius: 20, padding: '5px 16px',
                fontSize: 12, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 0.6,
                display: 'inline-block',
              }}>
                {data.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.7rem, 4vw, 2.5rem)',
            fontWeight: 800, color: '#1a1a2e',
            lineHeight: 1.25, margin: '0 0 20px',
          }}>
            {data.title || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Untitled Blog Post</span>}
          </h1>

          {/* Meta row */}
          {(formattedDate || data.author) && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 20,
              alignItems: 'center', color: '#666', fontSize: 14,
              marginBottom: 32, paddingBottom: 24,
              borderBottom: '1px solid #eee',
            }}>
              {formattedDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCalendar size={13} /> {formattedDate}
                </span>
              )}
              {data.author && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiUser size={13} /> {data.author}
                </span>
              )}
            </div>
          )}

          {/* Blog body — uses exact same CSS class as the public frontend */}
          <div
            className="blog-body"
            dangerouslySetInnerHTML={{
              __html: data.description
                || '<p style="color:#bbb;font-style:italic">No content written yet. Start typing in the Description field to see your content here.</p>',
            }}
          />

          {/* Tags */}
          {data.tags?.length > 0 && (
            <div style={{
              marginTop: 40, paddingTop: 24,
              borderTop: '1px solid #eee',
              display: 'flex', flexWrap: 'wrap', gap: 8,
            }}>
              {data.tags.map(tag => (
                <span key={tag} style={{
                  background: '#eff1ff', border: '1px solid #d0d3ee',
                  borderRadius: 20, padding: '5px 14px',
                  fontSize: 13, color: '#474972', fontWeight: 500,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
