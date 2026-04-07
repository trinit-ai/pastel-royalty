import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from './test-utils'

import Home from '../pages/Home'
import Exhibitions from '../pages/Exhibitions'
import ExhibitionDetail from '../pages/ExhibitionDetail'
import Artists from '../pages/Artists'
import ArtistDetail from '../pages/ArtistDetail'
import News from '../pages/News'
import NewsDetail from '../pages/NewsDetail'
import About from '../pages/About'
import Services from '../pages/Services'
import Legal from '../pages/Legal'
import NotFound from '../pages/NotFound'

describe('Page smoke tests', () => {
  it('Home renders', () => {
    render(renderWithProviders(<Home galleryName="Test Gallery" />))
    expect(screen.getByText(/Current Exhibition/i)).toBeInTheDocument()
  })

  it('Exhibitions renders', () => {
    render(renderWithProviders(<Exhibitions />))
    expect(screen.getAllByText(/Exhibitions/i).length).toBeGreaterThan(0)
  })

  it('ExhibitionDetail renders for a known slug', () => {
    render(
      renderWithProviders(
        <Routes>
          <Route path="/exhibitions/:slug" element={<ExhibitionDetail />} />
        </Routes>,
        { route: '/exhibitions/still-life-with-light' }
      )
    )
    expect(screen.getAllByText(/Still Life with Light/i).length).toBeGreaterThan(0)
  })

  it('ExhibitionDetail shows not-found for unknown slug', () => {
    render(
      renderWithProviders(
        <Routes>
          <Route path="/exhibitions/:slug" element={<ExhibitionDetail />} />
        </Routes>,
        { route: '/exhibitions/does-not-exist' }
      )
    )
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it('Artists renders', () => {
    render(renderWithProviders(<Artists />))
    expect(screen.getAllByText(/Artists/i).length).toBeGreaterThan(0)
  })

  it('ArtistDetail renders for a known slug', () => {
    render(
      renderWithProviders(
        <Routes>
          <Route path="/artists/:slug" element={<ArtistDetail />} />
        </Routes>,
        { route: '/artists/elena-marsh' }
      )
    )
    expect(screen.getAllByText(/Elena Marsh/i).length).toBeGreaterThan(0)
  })

  it('News renders', () => {
    render(renderWithProviders(<News />))
    expect(screen.getAllByText(/News/i).length).toBeGreaterThan(0)
  })

  it('NewsDetail renders', () => {
    render(
      renderWithProviders(
        <Routes>
          <Route path="/news/:slug" element={<NewsDetail />} />
        </Routes>,
        { route: '/news/coastal-contemporary-2027' }
      )
    )
    expect(document.body.textContent.length).toBeGreaterThan(0)
  })

  it('About renders', () => {
    render(renderWithProviders(<About />))
    expect(screen.getAllByText(/Gallery/i).length).toBeGreaterThan(0)
  })

  it('Services renders', () => {
    render(renderWithProviders(<Services />))
    expect(screen.getAllByText(/Services/i).length).toBeGreaterThan(0)
  })

  it('Legal renders for privacy-policy slug', () => {
    render(
      renderWithProviders(
        <Routes>
          <Route path="/legal/:slug" element={<Legal />} />
        </Routes>,
        { route: '/legal/privacy-policy' }
      )
    )
    expect(screen.getAllByText(/Privacy/i).length).toBeGreaterThan(0)
  })

  it('NotFound renders', () => {
    render(renderWithProviders(<NotFound />))
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
