import { createContext, useContext, useState, useCallback, useRef } from 'react'

const LightboxContext = createContext(null)

/**
 * Lightbox state provider.
 * Wraps the app to provide open/close/navigate anywhere.
 *
 * Usage:
 *   <LightboxProvider>
 *     <App />
 *     <Lightbox />
 *   </LightboxProvider>
 *
 * Then in any component:
 *   const { open } = useLightbox()
 *   open(artworks, 0, event.target.getBoundingClientRect())
 */
export function LightboxProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    items: [],
    currentIndex: 0,
    sourceRect: null,
    detailsVisible: false,
  })

  const open = useCallback((items, index = 0, sourceRect = null) => {
    setState({
      isOpen: true,
      items,
      currentIndex: index,
      sourceRect,
      detailsVisible: false,
    })
  }, [])

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, detailsVisible: false }))
  }, [])

  const next = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.items.length,
      detailsVisible: false,
    }))
  }, [])

  const prev = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
      detailsVisible: false,
    }))
  }, [])

  const toggleDetails = useCallback(() => {
    setState(prev => ({ ...prev, detailsVisible: !prev.detailsVisible }))
  }, [])

  const value = {
    ...state,
    current: state.items[state.currentIndex] || null,
    open,
    close,
    next,
    prev,
    toggleDetails,
  }

  return (
    <LightboxContext.Provider value={value}>
      {children}
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider')
  return ctx
}
