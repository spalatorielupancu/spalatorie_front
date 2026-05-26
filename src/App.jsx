import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminLogin from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import TestimonialeAdmin from './admin/TestimonialeAdmin';
import GalerieAdmin from './admin/GalerieAdmin';
import ContentAdmin from './admin/ContentAdmin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<ContentAdmin />} />
        <Route path="testimoniale" element={<TestimonialeAdmin />} />
        <Route path="galerie" element={<GalerieAdmin />} />
        <Route path="content" element={<ContentAdmin />} />
      </Route>
    </Routes>
  );
}
