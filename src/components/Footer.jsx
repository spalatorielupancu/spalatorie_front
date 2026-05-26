export default function Footer({ content }) {
  const phone    = content?.phone    ?? '0752 903 725';
  const whatsapp = content?.whatsapp ?? '40752903725';
  const founded  = content?.founded  ?? '2019';
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;
  const waHref    = `https://wa.me/${whatsapp}`;

  return (
    <footer>
      <div className="foot-inner">
        <a href="#top" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span>Lupancu <small>din {founded} · Satu Mare</small></span>
        </a>
        <div className="meta">
          <a href={phoneHref}>{phone}</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <span>© {new Date().getFullYear()}</span>
          {import.meta.env.DEV && (
            <a href="/admin/login" style={{ fontSize: 11, opacity: .35, letterSpacing: '0.08em' }}>admin</a>
          )}
        </div>
      </div>
    </footer>
  );
}
