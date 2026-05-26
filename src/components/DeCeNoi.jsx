const FEATURES = [
  {
    title: 'Curățare în profunzime',
    desc: 'Spălare prin imersie pentru covoare și extracție pentru tapițerii — praful și acarienii ies din fibră, nu doar de la suprafață.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9 7 5 9 5 14a7 7 0 0 0 14 0c0-5-4-7-7-12z"/>
      </svg>
    ),
  },
  {
    title: 'Detergenți profesionali',
    desc: 'Soluții biodegradabile, fără înălbitori agresivi. Sigure pentru copiii care se târăsc pe covor și pentru animalele de companie.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 1-7-7c0-4.33 5-10 7-12 2 2 7 7.67 7 12a7 7 0 0 1-7 7z"/>
        <path d="M9 17a3 3 0 0 0 6 0"/>
      </svg>
    ),
  },
  {
    title: 'Termen scurt',
    desc: 'De obicei 48-72 ore — în funcție de mărime și încărcare. Te anunțăm exact când îți aducem covorul înapoi.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 2"/>
      </svg>
    ),
  },
  {
    title: 'Tratăm fiecare fibră separat',
    desc: 'Lână, mătase, viscoză, bumbac, sintetice — soluție și temperatură diferite pentru fiecare. Niciodată „one-size-fits-all".',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3"  width="7" height="7" rx="1"/>
        <rect x="14" y="3"  width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
];

export default function DeCeNoi({ content }) {
  const founded = parseInt(content?.founded ?? '2019', 10);
  const years   = new Date().getFullYear() - founded;

  return (
    <section className="de-ce" id="de-ce" data-screen-label="03 De ce noi">
      <div className="wrap">
        <span className="eyebrow">De ce noi</span>
        <h2 className="serif">
          Aproape <em className="serif-it">{years} ani</em> de covoare scoase ca noi.
        </h2>
        <p className="lead">
          Din {founded} lucrăm cu sute de familii din comuna Satu Mare și împrejurimi. Aceleași mâini, aceeași grijă, același rezultat.
        </p>

        <div className="stats">
          {[
            { n: years,  sup: 'ani', label: 'de când spălăm covoarele Bucovinei' },
            { n: '100',  sup: '%',   label: 'soluții sigure pentru copii și animale' },
            { n: '0',    sup: 'lei', label: 'ridicare și livrare în comună și împrejurimi' },
            { n: '24',   sup: 'h',   label: 'programare prin telefon sau WhatsApp' },
          ].map((s) => (
            <div key={s.sup} className="stat">
              <div className="stat-n">{s.n}<sup>{s.sup}</sup></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature">
              <div className="feature-ic" aria-hidden="true">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
