import { useEffect, useState } from 'react';
import { api } from '../api';

const SECTIONS = [
  {
    title: 'Contact',
    fields: [
      { key: 'phone',       label: 'Număr telefon (afisat)',    placeholder: '0752 903 725' },
      { key: 'whatsapp',    label: 'Număr WhatsApp (intl, fără +)', placeholder: '40752903725' },
      { key: 'address',     label: 'Adresă afișată',            placeholder: 'Satu Mare, jud. Suceava' },
      { key: 'maps_query',  label: 'Termen căutare Google Maps', placeholder: 'Satu+Mare+Suceava' },
    ],
  },
  {
    title: 'Hero (prima secțiune)',
    fields: [
      { key: 'hero_title',      label: 'Titlu — linia normală',     placeholder: 'Covorul tău,' },
      { key: 'hero_em',         label: 'Titlu — linia italică',     placeholder: 'ca nou.' },
      { key: 'hero_sub',        label: 'Subtitlu hero',             placeholder: 'Spălătorie profesională...', textarea: true },
      { key: 'location_short',  label: 'Locație badge (sub titlu)', placeholder: 'Satu Mare · jud. Suceava' },
      { key: 'founded',         label: 'Anul înființării',          placeholder: '2019' },
    ],
  },
  {
    title: 'Hero — cele 3 statistici mici',
    fields: [
      { key: 'hero_fn1_title', label: 'Statistică 1 — titlu', placeholder: 'Ridicare gratuită' },
      { key: 'hero_fn1_desc',  label: 'Statistică 1 — descriere', placeholder: 'în comună & împrejurimi' },
      { key: 'hero_fn2_title', label: 'Statistică 2 — titlu', placeholder: 'Uscare controlată' },
      { key: 'hero_fn2_desc',  label: 'Statistică 2 — descriere', placeholder: 'covor parfumat, gata de pus' },
      { key: 'hero_fn3_title', label: 'Statistică 3 — titlu', placeholder: 'Detergenți profesionali' },
      { key: 'hero_fn3_desc',  label: 'Statistică 3 — descriere', placeholder: 'siguri pentru copii & animale' },
    ],
  },
  {
    title: 'Program',
    fields: [
      { key: 'program_luni',      label: 'Ore Luni – Sâmbătă',     placeholder: '08:00 – 19:00' },
      { key: 'program_luni_note', label: 'Notă Luni – Sâmbătă',    placeholder: 'Ridicări & livrări programate.' },
      { key: 'program_dum',       label: 'Ore Duminică',           placeholder: 'la cerere' },
      { key: 'program_dum_note',  label: 'Notă Duminică',          placeholder: 'Răspundem rapid la WhatsApp...' },
    ],
  },
  {
    title: 'Secțiunea Contact',
    fields: [
      { key: 'contact_title', label: 'Titlu — linia normală', placeholder: 'Un telefon, și restul' },
      { key: 'contact_em',    label: 'Titlu — linia italică', placeholder: 'ne ocupăm noi.' },
      { key: 'contact_sub',   label: 'Subtitlu contact',     placeholder: 'Sună sau scrie pe WhatsApp...', textarea: true },
    ],
  },
];

export default function ContentAdmin() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    api.getContent().then(setValues).catch(console.error);
  }, []);

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.bulkContent(values);
      setMsg('Conținut salvat cu succes.');
    } catch (err) {
      setMsg(`Eroare: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const isOk  = (s) => s && !s.startsWith('Eroare');
  const msgBg = isOk(msg) ? '#dcfce7' : undefined;
  const msgFg = isOk(msg) ? '#166534' : undefined;

  return (
    <>
      <div className="admin-header">
        <h1>Conținut site</h1>
        <p>Editează textele, contactul și orarul afișate pe site.</p>
      </div>

      {msg && <div className="admin-error" style={{ background: msgBg, color: msgFg, marginBottom: 16 }}>{msg}</div>}

      <form onSubmit={save}>
        {SECTIONS.map((section) => (
          <div key={section.title} className="admin-card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {section.title}
            </h3>
            <div className="admin-form">
              {section.fields.map((f) => (
                <div key={f.key} className="admin-field">
                  <label>{f.label}</label>
                  {f.textarea ? (
                    <textarea
                      value={values[f.key] ?? ''}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                    />
                  ) : (
                    <input
                      value={values[f.key] ?? ''}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ position: 'sticky', bottom: 0, background: '#f8fafc', padding: '12px 0', borderTop: '1px solid var(--line)' }}>
          <button type="submit" className="btn-admin primary" disabled={saving}>
            {saving ? 'Se salvează...' : 'Salvează tot conținutul'}
          </button>
        </div>
      </form>
    </>
  );
}
