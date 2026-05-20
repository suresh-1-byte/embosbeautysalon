import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import KoreanBeauty from './pages/KoreanBeauty';
import BridalStudio from './pages/BridalStudio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/korean-beauty" element={<KoreanBeauty />} />
        <Route path="/bridal-studio" element={<BridalStudio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
