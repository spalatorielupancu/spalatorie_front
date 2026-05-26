import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

const EMPTY = { title: '', subtitle: '', beforeUrl: '', afterUrl: '', order: 0, visible: true };

// Comprimă imaginea la max 900px lățime și calitate 82% JPEG.
// Returnează un data URL (base64).
function compressImage(file, maxWidth = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function ImagePicker({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const b64 = await compressImage(file);
      onChange(b64);
    } catch {
      alert('Nu s-a putut procesa imaginea. Încearcă altă poză.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Preview */}
        {value ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={value}
              alt="preview"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line-2)' }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute', top: 6, right: 6,
                background: 'rgba(0,0,0,.6)', color: '#fff',
                border: 'none', borderRadius: '50%',
                width: 26, height: 26, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Șterge poza"
            >✕</button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border: '2px dashed var(--line-2)', borderRadius: 10,
              padding: '28px 16px', textAlign: 'center',
              cursor: 'pointer', color: 'var(--ink-soft)', fontSize: 13,
              transition: 'border-color .15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line-2)'}
          >
            {loading ? 'Se procesează...' : 'Apasă pentru a alege o poză de pe calculator'}
          </div>
        )}

        {/* Buton schimbare */}
        {value && (
          <button
            type="button"
            className="btn-admin ghost"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            style={{ alignSelf: 'flex-start' }}
          >
            {loading ? 'Se procesează...' : 'Schimbă poza'}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

export default function GalerieAdmin() {
  const [list, setList]       = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');

  const load = () => api.getAllGallery().then(setList).catch(console.error);
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ title: p.title, subtitle: p.subtitle, beforeUrl: p.beforeUrl, afterUrl: p.afterUrl, order: p.order, visible: p.visible });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.beforeUrl || !form.afterUrl) {
      setMsg('Eroare: adaugă ambele poze (înainte și după).');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updatePhoto(editing, form);
        setMsg('Fotografie actualizată.');
      } else {
        await api.createPhoto(form);
        setMsg('Fotografie adăugată.');
      }
      cancelEdit();
      load();
    } catch (err) {
      setMsg(`Eroare: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const remove = async (id) => {
    if (!confirm('Ștergi perechea de poze?')) return;
    await api.deletePhoto(id);
    load();
  };

  const toggle = async (p) => {
    await api.updatePhoto(p._id, { visible: !p.visible });
    load();
  };

  const isOk  = (s) => s && !s.startsWith('Eroare');
  const msgBg = isOk(msg) ? '#dcfce7' : undefined;
  const msgFg = isOk(msg) ? '#166534' : undefined;

  return (
    <>
      <div className="admin-header">
        <h1>Galerie Înainte / După</h1>
        <p>Alege poze direct de pe calculator — sunt comprimate automat înainte de salvare.</p>
      </div>

      {msg && (
        <div className="admin-error" style={{ background: msgBg, color: msgFg, marginBottom: 16 }}>
          {msg}
        </div>
      )}

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, fontSize: 15 }}>
          {editing ? 'Editează perechea' : 'Adaugă pereche nouă'}
        </h3>
        <form onSubmit={save} className="admin-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-field">
              <label>Titlu (ex: Covor persan)</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Subtitlu (ex: 3 × 4 m)</label>
              <input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ImagePicker
              label="Poză ÎNAINTE"
              value={form.beforeUrl}
              onChange={(v) => set('beforeUrl', v)}
            />
            <ImagePicker
              label="Poză DUPĂ"
              value={form.afterUrl}
              onChange={(v) => set('afterUrl', v)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="admin-field">
              <label>Ordine (număr mic = primul)</label>
              <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
            </div>
            <div className="admin-field" style={{ justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 'auto' }}>
                <input type="checkbox" checked={form.visible} onChange={(e) => set('visible', e.target.checked)} />
                Vizibil pe site
              </label>
            </div>
          </div>

          <div className="admin-actions">
            <button type="submit" className="btn-admin primary" disabled={saving}>
              {saving ? 'Se salvează...' : (editing ? 'Salvează modificările' : 'Adaugă în galerie')}
            </button>
            {editing && (
              <button type="button" className="btn-admin ghost" onClick={cancelEdit}>
                Anulează
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titlu</th>
              <th>Preview</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-soft)', fontStyle: 'italic', padding: 32 }}>
                  Nicio fotografie încă. Adaugă prima pereche mai sus.
                </td>
              </tr>
            )}
            {list.map((p) => (
              <tr key={p._id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.title}</div>
                  {p.subtitle && <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{p.subtitle}</div>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.beforeUrl && (
                      <img src={p.beforeUrl} alt="înainte" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)' }} />
                    )}
                    {p.afterUrl && (
                      <img src={p.afterUrl} alt="după" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)' }} />
                    )}
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${p.visible ? 'green' : 'gray'}`}>
                    {p.visible ? 'Vizibil' : 'Ascuns'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-admin ghost" onClick={() => startEdit(p)}>Editează</button>
                    <button className="btn-admin ghost" onClick={() => toggle(p)}>
                      {p.visible ? 'Ascunde' : 'Afișează'}
                    </button>
                    <button className="btn-admin danger" onClick={() => remove(p._id)}>Șterge</button>
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
