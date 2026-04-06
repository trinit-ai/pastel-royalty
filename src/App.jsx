import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LightboxProvider } from './hooks/useLightbox'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Newsletter from './components/layout/Newsletter'
import Lightbox from './components/lightbox/Lightbox'
import Home from './pages/Home'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetail from './pages/ExhibitionDetail'
import ScrollToTop from './components/ui/ScrollToTop'
import './styles/global.css'

const GALLERY_NAME = 'Pastel Royalty Gallery'

export default function App() {
  useSmoothScroll()

  return (
    <BrowserRouter>
      <LightboxProvider>
        <ScrollToTop />
        <Header galleryName={GALLERY_NAME} />
        <Routes>
          <Route path="/" element={<Home galleryName={GALLERY_NAME} />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/exhibitions/:slug" element={<ExhibitionDetail />} />
        </Routes>
        <Newsletter />
        <Footer galleryName={GALLERY_NAME} />
        <Lightbox />
      </LightboxProvider>
    </BrowserRouter>
  )
}
