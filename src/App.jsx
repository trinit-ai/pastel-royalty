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
import About from './pages/About'
import Services from './pages/Services'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import Legal from './pages/Legal'
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
          <Route path="/artists" element={<Artists />} />
          <Route path="/artists/:slug" element={<ArtistDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/legal/:slug" element={<Legal />} />
        </Routes>
        <Newsletter />
        <Footer galleryName={GALLERY_NAME} />
        <Lightbox />
      </LightboxProvider>
    </BrowserRouter>
  )
}
