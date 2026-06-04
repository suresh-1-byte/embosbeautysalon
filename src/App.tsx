import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import KoreanBeauty from './pages/KoreanBeauty';
import BridalStudio from './pages/BridalStudio';
import AboutUs from './pages/AboutUs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/korean-beauty" element={<KoreanBeauty />} />
        <Route path="/bridal-studio" element={<BridalStudio />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
