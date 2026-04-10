import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LightboxProvider } from './hooks/useLightbox'
import { InquireProvider } from './hooks/useInquire'
import InquireModal from './components/inquiry/InquireModal'
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
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import Private from './pages/Private'
import ScrollToTop from './components/ui/ScrollToTop'
import './styles/global.css'

const GALLERY_NAME = 'Pastel Royalty Gallery'

function AppShell() {
  useSmoothScroll()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Disable right-click on images (basic deterrent — not real DRM)
  useEffect(() => {
    const handler = (e) => {
      if (e.target?.tagName === 'IMG') e.preventDefault()
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  // Private portal renders without any chrome
  if (pathname === '/private') {
    return (
      <>
        <ScrollToTop />
        <Private />
      </>
    )
  }

  return (
    <InquireProvider>
      <LightboxProvider>
        <ScrollToTop />
        <Header galleryName={GALLERY_NAME} />
        <main key={pathname} className="route-fade">
          <Routes>
            <Route path="/" element={<Home galleryName={GALLERY_NAME} />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/exhibitions/:slug" element={<ExhibitionDetail />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:slug" element={<ArtistDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/legal/:slug" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Newsletter hideGuild={isHome} />
        <Footer galleryName={GALLERY_NAME} />
        <Lightbox />
        <InquireModal />
      </LightboxProvider>
    </InquireProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
