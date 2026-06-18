import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy-load all pages — only the Home page bundle loads on first visit
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const KoreanBeauty = lazy(() => import('./pages/KoreanBeauty'));
const BridalStudio = lazy(() => import('./pages/BridalStudio'));
const AboutUs = lazy(() => import('./pages/AboutUs'));

// Minimal fallback — avoids layout shift while page chunk loads
function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #F4C2C2', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/korean-beauty" element={<KoreanBeauty />} />
          <Route path="/bridal-studio" element={<BridalStudio />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
