import { createContext, useContext, useState, useCallback } from 'react'

const InquireContext = createContext(null)

/**
 * Global inquiry modal state.
 * Any component can call openInquire() with optional context.
 *
 * Usage:
 *   const { openInquire } = useInquire()
 *   openInquire({ artwork })          // pre-filled with artwork context
 *   openInquire({ exhibition })       // pre-filled with exhibition context
 *   openInquire()                     // generic "Get in Touch"
 */
export function InquireProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    artwork: null,
    exhibition: null,
  })

  const openInquire = useCallback(({ artwork = null, exhibition = null } = {}) => {
    setState({ isOpen: true, artwork, exhibition })
  }, [])

  const closeInquire = useCallback(() => {
    setState({ isOpen: false, artwork: null, exhibition: null })
  }, [])

  return (
    <InquireContext.Provider value={{ ...state, openInquire, closeInquire }}>
      {children}
    </InquireContext.Provider>
  )
}

export function useInquire() {
  const ctx = useContext(InquireContext)
  if (!ctx) throw new Error('useInquire must be used within InquireProvider')
  return ctx
}
