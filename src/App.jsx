import { LightboxProvider } from './hooks/useLightbox'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Lightbox from './components/lightbox/Lightbox'
import Home from './pages/Home'
import './styles/global.css'

const GALLERY_NAME = import.meta.env.VITE_SITE_NAME || 'Pastel Royalty Gallery'

export default function App() {
  useSmoothScroll()

  return (
    <LightboxProvider>
      <Header galleryName={GALLERY_NAME} />
      <Home galleryName={GALLERY_NAME} />
      <Footer galleryName={GALLERY_NAME} />
      <Lightbox />
    </LightboxProvider>
  )
}
