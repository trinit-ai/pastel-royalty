import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { InquireProvider, useInquire } from '../hooks/useInquire'
import { LightboxProvider, useLightbox } from '../hooks/useLightbox'

describe('useInquire', () => {
  const wrapper = ({ children }) => <InquireProvider>{children}</InquireProvider>

  it('starts closed with no context', () => {
    const { result } = renderHook(() => useInquire(), { wrapper })
    expect(result.current.isOpen).toBe(false)
    expect(result.current.artwork).toBe(null)
    expect(result.current.exhibition).toBe(null)
  })

  it('opens with no context', () => {
    const { result } = renderHook(() => useInquire(), { wrapper })
    act(() => result.current.openInquire())
    expect(result.current.isOpen).toBe(true)
  })

  it('opens with artwork context', () => {
    const { result } = renderHook(() => useInquire(), { wrapper })
    const artwork = { title: 'Camellias I', artistName: 'Rob Ventura' }
    act(() => result.current.openInquire({ artwork }))
    expect(result.current.isOpen).toBe(true)
    expect(result.current.artwork).toEqual(artwork)
  })

  it('opens with exhibition context', () => {
    const { result } = renderHook(() => useInquire(), { wrapper })
    const exhibition = { title: 'Still Life with Light' }
    act(() => result.current.openInquire({ exhibition }))
    expect(result.current.isOpen).toBe(true)
    expect(result.current.exhibition).toEqual(exhibition)
  })

  it('closes and clears context', () => {
    const { result } = renderHook(() => useInquire(), { wrapper })
    act(() => result.current.openInquire({ artwork: { title: 'X', artistName: 'Y' } }))
    act(() => result.current.closeInquire())
    expect(result.current.isOpen).toBe(false)
    expect(result.current.artwork).toBe(null)
  })

  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useInquire())).toThrow(/InquireProvider/)
  })
})

describe('useLightbox', () => {
  const wrapper = ({ children }) => <LightboxProvider>{children}</LightboxProvider>

  it('starts closed with empty items', () => {
    const { result } = renderHook(() => useLightbox(), { wrapper })
    expect(result.current.isOpen).toBe(false)
  })

  it('opens with items', () => {
    const { result } = renderHook(() => useLightbox(), { wrapper })
    const items = [
      { title: 'A', artistName: 'X' },
      { title: 'B', artistName: 'Y' },
    ]
    act(() => result.current.open(items, 0))
    expect(result.current.isOpen).toBe(true)
    expect(result.current.currentIndex).toBe(0)
  })

  it('navigates next and prev', () => {
    const { result } = renderHook(() => useLightbox(), { wrapper })
    act(() => result.current.open([{ title: 'A' }, { title: 'B' }, { title: 'C' }], 0))
    act(() => result.current.next())
    expect(result.current.currentIndex).toBe(1)
    act(() => result.current.next())
    expect(result.current.currentIndex).toBe(2)
    act(() => result.current.prev())
    expect(result.current.currentIndex).toBe(1)
  })

  it('closes', () => {
    const { result } = renderHook(() => useLightbox(), { wrapper })
    act(() => result.current.open([{ title: 'A' }], 0))
    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })
})
