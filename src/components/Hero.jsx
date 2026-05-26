import { useEffect, useRef } from 'react';

export default function Hero({ content }) {
  const canvasRef = useRef(null);

  const phone     = content?.phone    ?? '0752 903 725';
  const whatsapp  = content?.whatsapp ?? '40752903725';
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;
  const waHref    = `https://wa.me/${whatsapp}`;
  const loc       = content?.location_short ?? 'Satu Mare · jud. Suceava';
  const founded   = content?.founded ?? '2019';

  const fn1t = content?.hero_fn1_title ?? 'Ridicare gratuită';
  const fn1d = content?.hero_fn1_desc  ?? 'în comună & împrejurimi';
  const fn2t = content?.hero_fn2_title ?? 'Uscare controlată';
  const fn2d = content?.hero_fn2_desc  ?? 'covor parfumat, gata de pus';
  const fn3t = content?.hero_fn3_title ?? 'Detergenți profesionali';
  const fn3d = content?.hero_fn3_desc  ?? 'siguri pentru copii & animale';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window.FluidShader === 'undefined') return;
    try {
      window.__fluidShader = new window.FluidShader(canvas);
    } catch (e) {
      console.warn('Fluid shader failed:', e);
    }
    return () => {
      if (window.__fluidShader?.destroy) window.__fluidShader.destroy();
    };
  }, []);

  return (
    <header className="hero" id="top" data-screen-label="01 Hero">
      <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-meta">
          <span className="dot" aria-hidden="true" />
          <span>{loc} · din {founded}</span>
        </div>

        <h1 className="serif">
          {content?.hero_title ?? 'Covorul tău,'}<br />
          <em>{content?.hero_em ?? 'ca nou.'}</em>
        </h1>

        <p className="hero-sub">
          {content?.hero_sub ?? 'Spălătorie profesională de covoare, mochete și tapițerii. Ridicare și livrare gratuită în comuna Satu Mare și împrejurimi.'}
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={phoneHref}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Sună acum<span className="hero-btn-phone"> &nbsp;·&nbsp; {phone}</span></span>
          </a>
          <a className="btn btn-ghost" href={waHref} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.5 14.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4 0-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="hero-footnote">
          <div><b>{fn1t}</b><br />{fn1d}</div>
          <div><b>{fn2t}</b><br />{fn2d}</div>
          <div><b>{fn3t}</b><br />{fn3d}</div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="line" />
      </div>
    </header>
  );
}
