const steps = [
  { n: '01', title: 'Sună sau scrie', desc: 'Ne suni la 0752 903 725 sau ne scrii pe WhatsApp. Discutăm despre ce ai de spălat și stabilim o oră.' },
  { n: '02', title: 'Venim & ridicăm', desc: 'Ajungem la ușa ta la ora stabilită și ridicăm covoarele. Gratuit, în comună și împrejurimi.' },
  { n: '03', title: 'Spălăm profesional', desc: 'În spălătorie, tratăm fiecare covor cu soluția potrivită, spălăm în profunzime și uscăm controlat.' },
  { n: '04', title: 'Livrăm uscat', desc: 'Îți aducem covorul înapoi acasă: uscat, parfumat, împachetat, gata de întins pe podea.' },
];

const ArrowIcon = () => (
  <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export default function Proces() {
  return (
    <section className="proces" id="proces" data-screen-label="04 Procesul">
      <div className="wrap">
        <div className="head">
          <div>
            <span className="eyebrow">Procesul</span>
            <h2 className="serif" style={{ marginTop: 14 }}>Patru pași. <em className="serif-it">Fără bătaie de cap.</em></h2>
          </div>
          <p className="lead">Tu suni — restul facem noi. Venim, ridicăm covorul, îl spălăm și ți-l aducem înapoi uscat, parfumat și gata de pus pe podea.</p>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <article key={s.n} className="step">
              <div className="step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ArrowIcon />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
