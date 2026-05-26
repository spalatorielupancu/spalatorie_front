export default function Program({ content }) {
  const luniOre  = content?.program_luni      ?? '08:00 – 19:00';
  const luniNote = content?.program_luni_note ?? 'Ridicări & livrări programate.';
  const dumOre   = content?.program_dum       ?? 'la cerere';
  const dumNote  = content?.program_dum_note  ?? 'Răspundem rapid la WhatsApp și programăm pentru ziua următoare.';

  // Evidențiem "WhatsApp" cu bold în notă dacă apare
  const renderNote = (text) => {
    const parts = text.split('WhatsApp');
    if (parts.length === 1) return text;
    return parts.flatMap((p, i) => i < parts.length - 1 ? [p, <b key={i}>WhatsApp</b>] : [p]);
  };

  return (
    <section className="program" id="program" data-screen-label="08 Program">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Program</span>
          <h2 className="serif" style={{ marginTop: 14 }}>Aproape <em className="serif-it">oricând</em> ai nevoie.</h2>
        </div>
        <div className="prog-grid">
          <div className="prog-card">
            <div className="prog-day">Luni — Sâmbătă</div>
            <div className="prog-time">{luniOre}</div>
            <div className="prog-note">{luniNote}</div>
          </div>
          <div className="prog-card live">
            <div className="prog-day">Duminică</div>
            <div className="prog-time">{dumOre}</div>
            <div className="prog-note">{renderNote(dumNote)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
