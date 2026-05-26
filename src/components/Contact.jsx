export default function Contact({ content }) {
  const phone     = content?.phone       ?? '0752 903 725';
  const whatsapp  = content?.whatsapp    ?? '40752903725';
  const address   = content?.address     ?? 'Satu Mare, jud. Suceava';
  const mapsQ     = content?.maps_query  ?? 'Satu+Mare+Suceava';
  const title     = content?.contact_title ?? 'Un telefon, și restul';
  const em        = content?.contact_em    ?? 'ne ocupăm noi.';
  const sub       = content?.contact_sub   ?? 'Sună sau scrie pe WhatsApp pentru o ofertă personalizată. Răspundem rapid și venim când îți convine ție.';

  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;
  const waHref    = `https://wa.me/${whatsapp}`;
  const mapsHref  = `https://maps.google.com/?q=${mapsQ}`;

  return (
    <section className="contact" id="contact" data-screen-label="07 Contact">
      <div className="wrap">
        <span className="eyebrow">Contact</span>
        <h2 className="serif">{title} <em className="serif-it">{em}</em></h2>
        <p className="lead">{sub}</p>

        <div className="contact-grid">
          <div className="c-channels">
            <a className="c-channel" href={phoneHref}>
              <div className="c-channel-ic" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="c-channel-meta">
                <div className="c-channel-lbl">Telefon</div>
                <div className="c-channel-val">{phone}</div>
              </div>
              <svg className="c-channel-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>

            <a className="c-channel" href={waHref} target="_blank" rel="noopener noreferrer">
              <div className="c-channel-ic" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4 0-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                </svg>
              </div>
              <div className="c-channel-meta">
                <div className="c-channel-lbl">WhatsApp</div>
                <div className="c-channel-val">Scrie-ne direct</div>
              </div>
              <svg className="c-channel-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>

            <a className="c-channel" href={mapsHref} target="_blank" rel="noopener noreferrer">
              <div className="c-channel-ic" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="c-channel-meta">
                <div className="c-channel-lbl">Adresă</div>
                <div className="c-channel-val">{address}</div>
              </div>
              <svg className="c-channel-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <div className="map-card" aria-hidden="true">
            <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0a2540" />
                  <stop offset="100%" stopColor="#001a33" />
                </linearGradient>
                <pattern id="mapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(34,211,238,.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="320" fill="url(#mapBg)" />
              <rect width="400" height="320" fill="url(#mapGrid)" />
              <path d="M 0 180 Q 100 160 200 170 T 400 150" fill="none" stroke="rgba(34,211,238,.18)" strokeWidth="2" />
              <path d="M 200 0 Q 220 100 200 170 T 180 320" fill="none" stroke="rgba(34,211,238,.15)" strokeWidth="1.5" />
              <path d="M 0 90 Q 120 110 200 100 T 400 80" fill="none" stroke="rgba(34,211,238,.10)" strokeWidth="1" />
              <path d="M 0 260 Q 150 240 200 250 T 400 230" fill="none" stroke="rgba(34,211,238,.10)" strokeWidth="1" />
              <path d="M 0 220 Q 80 200 160 215 Q 240 230 320 200 T 400 195" fill="none" stroke="rgba(34,211,238,.25)" strokeWidth="3" />
            </svg>
            <div className="map-pin">
              <div className="map-pin-dot" />
              <div className="map-pin-label">Spălătoria Lupancu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
