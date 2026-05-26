export default function Servicii() {
  const servicii = [
    { n: '01', title: 'Covoare', desc: 'Persane, handmade, modern, lână, mătase sau sintetice. Tratăm fiecare tip cu soluția potrivită.' },
    { n: '02', title: 'Mochete', desc: 'Mocheta din case, birouri, hoteluri sau pensiuni — curățată în profunzime, fără demontare.' },
    { n: '03', title: 'Tapițerie', desc: 'Canapele, fotolii, scaune și alte materiale textile. Igienizare în profunzime, uscare rapidă.' },
    { n: '04', title: 'Pete & mirosuri', desc: 'Eliminăm petele dificile și mirosurile lăsate de animalele de companie — la nivel de fibră.' },
  ];

  return (
    <section className="servicii" id="servicii" data-screen-label="02 Servicii">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Servicii</span>
          <h2 className="serif">Curățăm <em className="serif-it">tot ce e textil</em> în casa ta.</h2>
          <p className="lead">Echipamente profesionale, soluții sigure pentru copii și animale, și o uscare controlată care lasă fibrele ca noi. Fără mirosuri, fără surprize.</p>
        </div>
        <div className="svc-grid">
          {servicii.map((s) => (
            <article key={s.n} className="svc-card">
              <div>
                <div className="svc-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div className="blob" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
