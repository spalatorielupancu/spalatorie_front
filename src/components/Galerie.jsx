import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

// ── Slider înainte / după ────────────────────────────────────────────────────
function BeforeAfterSlider({ beforeUrl, afterUrl, title }) {
  const [pos, setPos] = useState(50);          // procentaj 0-100
  const containerRef  = useRef(null);
  const dragging      = useRef(false);

  const calcPos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    containerRef.current.setPointerCapture(e.pointerId);
    setPos(calcPos(e.clientX));
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setPos(calcPos(e.clientX));
  };

  const onPointerUp = () => { dragging.current = false; };

  const pill = {
    position: 'absolute', top: 10,
    background: 'rgba(0,26,51,.55)', color: '#fff',
    fontSize: 10, fontWeight: 500, letterSpacing: '0.14em',
    textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999,
    pointerEvents: 'none', userSelect: 'none',
    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
  };

  // Placeholder când nu există imaginile încă
  if (!beforeUrl && !afterUrl) {
    return (
      <div style={{
        aspectRatio: '4/3', background: 'linear-gradient(135deg,#e0edf6 0%,#d0e4f0 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 10, color: '#7a9bbf',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".6">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: .7 }}>
          Înainte / După
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'relative', aspectRatio: '4 / 3',
        overflow: 'hidden', cursor: 'ew-resize',
        userSelect: 'none', touchAction: 'none',
        background: '#b8c5d1',
      }}
    >
      {/* Imaginea DUPĂ — fundal complet */}
      {afterUrl && (
        <img
          src={afterUrl}
          alt={`${title} — după`}
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        />
      )}

      {/* Imaginea ÎNAINTE — decupată dinamic cu clip-path */}
      {beforeUrl && (
        <img
          src={beforeUrl}
          alt={`${title} — înainte`}
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Label Înainte — sus-stânga */}
      <span style={{ ...pill, left: 10 }}>Înainte</span>

      {/* Label După — sus-dreapta */}
      <span style={{ ...pill, right: 10 }}>După</span>

      {/* Linia + bulina de glisare */}
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${pos}%`, transform: 'translateX(-50%)',
          width: 2, background: 'rgba(255,255,255,.9)',
          boxShadow: '0 0 8px rgba(0,0,0,.25)',
          pointerEvents: 'none',
        }}
      >
        {/* Bulina */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 38, height: 38, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,.25), 0 0 0 1.5px rgba(0,0,0,.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 3,
        }}>
          {/* Săgeți stânga-dreapta */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Card galerie ─────────────────────────────────────────────────────────────
function GalCard({ photo }) {
  return (
    <article className="gal-card">
      <BeforeAfterSlider
        beforeUrl={photo.beforeUrl}
        afterUrl={photo.afterUrl}
        title={photo.title}
      />
      <div className="gal-meta">
        <h4>{photo.title}</h4>
        {photo.subtitle && <span>{photo.subtitle}</span>}
      </div>
    </article>
  );
}

// ── Placeholder când nu există poze în DB ────────────────────────────────────
const PLACEHOLDERS = [
  { _id: 'p1', title: 'Covor persan',   subtitle: '3 × 4 m',    beforeUrl: '', afterUrl: '' },
  { _id: 'p2', title: 'Canapea fixă',   subtitle: '3 locuri',   beforeUrl: '', afterUrl: '' },
  { _id: 'p3', title: 'Mochetă living', subtitle: '~ 24 m²',    beforeUrl: '', afterUrl: '' },
];

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="gal-card">
      <div className="skeleton" style={{ aspectRatio: '4/3', width: '100%' }} />
      <div className="gal-meta">
        <div className="skeleton" style={{ width: 120, height: 20 }} />
        <div className="skeleton" style={{ width: 50,  height: 14 }} />
      </div>
    </div>
  );
}

// ── Secțiunea publică ────────────────────────────────────────────────────────
export default function Galerie() {
  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  const items = photos.length > 0 ? photos : PLACEHOLDERS;

  return (
    <section className="galerie" id="galerie" data-screen-label="05 Galerie">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Galerie · Înainte / După</span>
          <h2 className="serif">Diferența o vezi <em className="serif-it">cu ochiul liber.</em></h2>
          <p className="lead">Câteva exemple recente de la clienții noștri din comuna Satu Mare.</p>
        </div>

        <div className="gal-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((p) => <GalCard key={p._id} photo={p} />)
          }
        </div>

        {!loading && photos.length === 0 && (
          <p className="gal-note">Imaginile reale pot fi adăugate din panoul admin.</p>
        )}
      </div>
    </section>
  );
}
