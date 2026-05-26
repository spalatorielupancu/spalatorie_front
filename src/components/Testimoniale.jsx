import { useEffect, useState } from 'react';
import { api } from '../api';

const FALLBACK = [
  { _id: 'f1', name: 'Maria P.',    location: 'Satu Mare', stars: 5, quote: '„Au venit la ora stabilită, au ridicat covoarele și le-au adus înapoi în două zile. Arată ca atunci când le-am cumpărat. Recomand cu drag."' },
  { _id: 'f2', name: 'Ionuț D.',    location: 'Suceava',   stars: 5, quote: '„Aveam pete vechi de la pisică pe canapea. Am crezut că trebuie să schimb tapițeria. Au ieșit complet, fără urmă de miros. Mulțumesc!"' },
  { _id: 'f3', name: 'Georgeta L.', location: 'Bunești',   stars: 5, quote: '„Cinste oamenilor — ridicare gratuită, preț corect, lucru făcut ca la carte. Anul ăsta toate covoarele din casă au trecut pe la ei."' },
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.92 6.91L22 9.6l-5.2 4.84 1.54 7.06L12 17.77l-6.34 3.73L7.2 14.44 2 9.6l7.08-.69L12 2z" />
  </svg>
);

function SkeletonCard() {
  return (
    <div className="t-card" style={{ gap: 14 }}>
      <div className="skeleton" style={{ width: 80, height: 16, borderRadius: 4 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div className="skeleton" style={{ width: '100%', height: 14 }} />
        <div className="skeleton" style={{ width: '90%',  height: 14 }} />
        <div className="skeleton" style={{ width: '75%',  height: 14 }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
        <div className="skeleton" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ width: 90, height: 12 }} />
          <div className="skeleton" style={{ width: 60, height: 11 }} />
        </div>
      </div>
    </div>
  );
}

function TCard({ t }) {
  return (
    <article className="t-card">
      <div className="t-stars" aria-label={`${t.stars} din 5 stele`}>
        {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
      </div>
      <p className="t-quote">{t.quote}</p>
      <div className="t-author">
        <div className="t-avatar" aria-hidden="true">{t.name[0]}</div>
        <div>
          <div className="t-name">{t.name}</div>
          {t.location && <div className="t-where">{t.location}</div>}
        </div>
      </div>
    </article>
  );
}

export default function Testimoniale() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTestimonials()
      .then((data) => setList(data.length > 0 ? data : FALLBACK))
      .catch(() => setList(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="testimoniale" id="testimoniale" data-screen-label="06 Testimoniale">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Ce spun clienții</span>
          <h2 className="serif">Recomandarea cea mai bună e <em className="serif-it">cuvântul lor.</em></h2>
        </div>
        <div className="t-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : list.map((t) => <TCard key={t._id} t={t} />)
          }
        </div>
      </div>
    </section>
  );
}
