import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import { renderWithProviders } from './test-utils'

import PrivateView from '../pages/PrivateView'
import { PRIVATE_VIEWS, formatPrice, isExpired } from '../data/private-views'

const TOKEN = 'harding-autumn-2026'
const view = PRIVATE_VIEWS[TOKEN]

function renderAt(token) {
  return render(
    renderWithProviders(
      <Routes>
        <Route path="/private-view/:token" element={<PrivateView galleryName="Test Gallery" />} />
      </Routes>,
      { route: `/private-view/${token}` },
    ),
  )
}

afterEach(() => {
  vi.useRealTimers()
})

describe('PrivateView', () => {
  it('renders the selection for a valid token', () => {
    renderAt(TOKEN)
    expect(screen.getAllByText(new RegExp(view.title, 'i')).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Ms\. Harding/i).length).toBeGreaterThan(0)
  })

  it('names the collector it was prepared for', () => {
    renderAt(TOKEN)
    // Named in both the sticky ribbon and the confidential footer.
    expect(screen.getAllByText(/Prepared for Ms\. Harding/i)).toHaveLength(2)
    expect(screen.getByText(/Not for distribution/i)).toBeInTheDocument()
  })

  it('shows prices for available works — the point of a private view', () => {
    renderAt(TOKEN)
    expect(screen.getByText('$28,000')).toBeInTheDocument()
    expect(screen.getByText('$16,500')).toBeInTheDocument()
  })

  it('never shows a price for a sold work', () => {
    renderAt(TOKEN)
    // False Indigo is sold at 19000 — the number must not appear anywhere.
    expect(screen.queryByText('$19,000')).not.toBeInTheDocument()
    expect(screen.getAllByText(/^Sold$/i).length).toBeGreaterThan(0)
  })

  it('offers no reserve action on sold or NFS works', () => {
    renderAt(TOKEN)
    const actions = screen.getAllByRole('button', { name: /Reserve this work|Ask about this work/i })
    const sellable = view.works.filter((w) => w.status !== 'sold' && w.status !== 'nfs')
    expect(actions).toHaveLength(sellable.length)
  })

  it('shows the closed state for an unknown token', () => {
    renderAt('not-a-real-token')
    expect(screen.getByText(/no longer available/i)).toBeInTheDocument()
    // Must not leak any real content.
    expect(screen.queryByText(/Ms\. Harding/i)).not.toBeInTheDocument()
  })

  it('shows the closed state once the view has expired', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(`${view.expiresOn}T23:59:59`).getTime() + 1000)
    renderAt(TOKEN)
    expect(screen.getByText(/no longer available/i)).toBeInTheDocument()
  })
})

describe('private-view helpers', () => {
  it('formatPrice hides numbers behind sold and NFS', () => {
    expect(formatPrice({ status: 'available', price: 1500 })).toBe('$1,500')
    expect(formatPrice({ status: 'sold', price: 1500 })).toBe('Sold')
    expect(formatPrice({ status: 'nfs', price: 1500 })).toBe('Not for sale')
    expect(formatPrice({ status: 'available', price: null })).toBe('Price on request')
  })

  it('isExpired is inclusive of the final day', () => {
    const v = { expiresOn: '2026-10-21' }
    expect(isExpired(v, new Date('2026-10-21T09:00:00'))).toBe(false)
    expect(isExpired(v, new Date('2026-10-22T00:00:01'))).toBe(true)
  })
})

describe('gallery identity', () => {
  it('prefers the gallery named on the view over the site default', () => {
    renderAt(TOKEN)
    expect(screen.getByText('Kelly-McKenna Gallery')).toBeInTheDocument()
    expect(screen.queryByText('Test Gallery')).not.toBeInTheDocument()
  })

  it('falls back to the site gallery name on the closed state', () => {
    renderAt('not-a-real-token')
    expect(screen.getByText('Test Gallery')).toBeInTheDocument()
  })
})
