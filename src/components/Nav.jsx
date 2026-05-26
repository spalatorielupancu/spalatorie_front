import { useEffect, useState } from 'react';

export default function Nav({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const phone    = content?.phone    ?? '0752 903 725';
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <a href="#top" className="logo" aria-label="Spălătoria Lupancu">
        <span className="logo-mark" aria-hidden="true" />
        <span>
          Lupancu
          <small>Spălătorie covoare</small>
        </span>
      </a>
      <a className="nav-cta" href={phoneHref}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>{phone}</span>
      </a>
    </nav>
  );
}
