import { useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!localStorage.getItem('admin_token')) {
    return <Navigate to="/admin/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-shell">
      {/* Overlay mobil */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <a href="/" className="logo" style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex' }}>
          <span className="logo-mark" aria-hidden="true" />
          <span>Lupancu <small>Admin</small></span>
        </a>

        <nav className="admin-nav">
          <NavLink to="/admin/content"    className={({ isActive }) => isActive ? 'active' : ''} onClick={closeSidebar}>Conținut site</NavLink>
          <NavLink to="/admin/testimoniale" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeSidebar}>Testimoniale</NavLink>
          <NavLink to="/admin/galerie"    className={({ isActive }) => isActive ? 'active' : ''} onClick={closeSidebar}>Galerie</NavLink>
          <a href="/" target="_blank" rel="noopener noreferrer" onClick={closeSidebar}>Vezi site-ul</a>
        </nav>

        <button className="admin-logout" onClick={logout}>Deconectare</button>
      </aside>

      <main className="admin-main">
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Deschide meniu"
        >
          <span /><span /><span />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
