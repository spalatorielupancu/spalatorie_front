const BASE = import.meta.env.VITE_API_URL || '';

async function req(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    req('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Testimoniale
  getTestimonials:    () => req('/api/testimonials'),
  getAllTestimonials:  () => req('/api/testimonials/all'),
  createTestimonial:  (data) => req('/api/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial:  (id, data) => req(`/api/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial:  (id) => req(`/api/testimonials/${id}`, { method: 'DELETE' }),

  // Galerie
  getGallery:     () => req('/api/gallery'),
  getAllGallery:   () => req('/api/gallery/all'),
  createPhoto:    (data) => req('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updatePhoto:    (id, data) => req(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePhoto:    (id) => req(`/api/gallery/${id}`, { method: 'DELETE' }),

  // Continut site
  getContent:     () => req('/api/content'),
  updateContent:  (key, value) => req(`/api/content/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
  bulkContent:    (obj) => req('/api/content/bulk', { method: 'POST', body: JSON.stringify(obj) }),
};
