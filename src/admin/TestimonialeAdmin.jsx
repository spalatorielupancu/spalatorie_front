import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { name: '', location: '', quote: '', stars: 5, visible: true };

export default function TestimonialeAdmin() {
  const [list, setList]     = useState([]);
  const [form, setForm]     = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  const load = () => api.getAllTestimonials().then(setList).catch(console.error);
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (t) => { setEditing(t._id); setForm({ name: t.name, location: t.location, quote: t.quote, stars: t.stars, visible: t.visible }); };
  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.updateTestimonial(editing, form);
        setMsg('Testimonial actualizat.');
      } else {
        await api.createTestimonial(form);
        setMsg('Testimonial adăugat.');
      }
      cancelEdit();
      load();
    } catch (err) {
      setMsg(`Eroare: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const remove = async (id) => {
    if (!confirm('Ștergi testimonialul?')) return;
    await api.deleteTestimonial(id);
    load();
  };

  const toggle = async (t) => {
    await api.updateTestimonial(t._id, { visible: !t.visible });
    load();
  };

  return (
    <>
      <div className="admin-header">
        <h1>Testimoniale</h1>
        <p>Adaugă sau editează recenziile afișate pe site.</p>
      </div>

      {msg && <div className="admin-error" style={{ background: msg.startsWith('Eroare') ? undefined : '#dcfce7', color: msg.startsWith('Eroare') ? undefined : '#166534' }}>{msg}</div>}

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, fontSize: 15 }}>{editing ? 'Editează testimonial' : 'Adaugă testimonial nou'}</h3>
        <form onSubmit={save} className="admin-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-field">
              <label>Nume</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="ex: Maria P." />
            </div>
            <div className="admin-field">
              <label>Localitate</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="ex: Satu Mare" />
            </div>
          </div>
          <div className="admin-field">
            <label>Recenzie</label>
            <textarea value={form.quote} onChange={(e) => set('quote', e.target.value)} required placeholder='„Textul recenziei..."' rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-field">
              <label>Stele (1-5)</label>
              <input type="number" min={1} max={5} value={form.stars} onChange={(e) => set('stars', Number(e.target.value))} />
            </div>
            <div className="admin-field" style={{ justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} />
                Vizibil pe site
              </label>
            </div>
          </div>
          <div className="admin-actions">
            <button type="submit" className="btn-admin primary" disabled={saving}>{saving ? 'Se salvează...' : (editing ? 'Salvează' : 'Adaugă')}</button>
            {editing && <button type="button" className="btn-admin ghost" onClick={cancelEdit}>Anulează</button>}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Localitate</th>
              <th>Recenzie</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-soft)', fontStyle: 'italic' }}>Niciun testimonial încă.</td></tr>
            )}
            {list.map((t) => (
              <tr key={t._id}>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td>{t.location}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink-soft)' }}>{t.quote}</td>
                <td>
                  <span className={`admin-badge ${t.visible ? 'green' : 'gray'}`}>{t.visible ? 'Vizibil' : 'Ascuns'}</span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-admin ghost" onClick={() => startEdit(t)}>Editează</button>
                    <button className="btn-admin ghost" onClick={() => toggle(t)}>{t.visible ? 'Ascunde' : 'Afișează'}</button>
                    <button className="btn-admin danger" onClick={() => remove(t._id)}>Șterge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
