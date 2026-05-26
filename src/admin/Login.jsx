import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('admin_token', token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <div className="logo" style={{ color: 'var(--ink)', marginBottom: 24 }}>
          <span className="logo-mark" aria-hidden="true" />
          <span>Lupancu <small style={{ color: 'var(--ink-soft)' }}>Admin</small></span>
        </div>
        <h1>Autentificare</h1>
        <p>Accesează panoul de administrare</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={submit} className="admin-form">
          <div className="admin-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="admin-field">
            <label>Parolă</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-admin primary" disabled={loading}>
            {loading ? 'Se autentifică...' : 'Intră în admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
