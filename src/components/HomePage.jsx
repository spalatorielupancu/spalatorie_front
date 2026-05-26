import { useEffect, useState } from 'react';
import { api } from '../api';
import Nav from './Nav';
import Hero from './Hero';
import Servicii from './Servicii';
import DeCeNoi from './DeCeNoi';
import Proces from './Proces';
import Galerie from './Galerie';
import Testimoniale from './Testimoniale';
import Contact from './Contact';
import Program from './Program';
import Footer from './Footer';

// Valorile implicite — site-ul apare imediat, fara flash,
// iar dupa ce API-ul raspunde le inlocuieste cu datele reale din MongoDB.
const DEFAULTS = {
  phone:          '0752 903 725',
  whatsapp:       '40752903725',
  address:        'Satu Mare, jud. Suceava',
  maps_query:     'Satu+Mare+Suceava',

  hero_title:     'Covorul tău,',
  hero_em:        'ca nou.',
  hero_sub:       'Spălătorie profesională de covoare, mochete și tapițerii. Ridicare și livrare gratuită în comuna Satu Mare și împrejurimi.',
  location_short: 'Satu Mare · jud. Suceava',
  founded:        '2019',

  hero_fn1_title: 'Ridicare gratuită',
  hero_fn1_desc:  'în comună & împrejurimi',
  hero_fn2_title: 'Uscare controlată',
  hero_fn2_desc:  'covor parfumat, gata de pus',
  hero_fn3_title: 'Detergenți profesionali',
  hero_fn3_desc:  'siguri pentru copii & animale',

  program_luni:      '08:00 – 19:00',
  program_luni_note: 'Ridicări & livrări programate.',
  program_dum:       'la cerere',
  program_dum_note:  'Răspundem rapid la WhatsApp și programăm pentru ziua următoare.',

  contact_title: 'Un telefon, și restul',
  contact_em:    'ne ocupăm noi.',
  contact_sub:   'Sună sau scrie pe WhatsApp pentru o ofertă personalizată. Răspundem rapid și venim când îți convine ție.',
};

export default function HomePage() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    api.getContent()
      .then((data) => setContent((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  return (
    <>
      <Nav content={content} />
      <Hero content={content} />
      <Servicii />
      <DeCeNoi content={content} />
      <Proces />
      <Galerie />
      <Testimoniale />
      <Contact content={content} />
      <Program content={content} />
      <Footer content={content} />
    </>
  );
}
