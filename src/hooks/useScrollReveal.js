import { useEffect, useRef } from 'react'

export function useScrollReveal(deps = []) {
  const observerRef = useRef(null)

  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observerRef.current.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Small delay to let DOM render after state change
    requestAnimationFrame(() => {
      document.querySelectorAll('.reveal:not(.visible), .reveal-scale:not(.visible), .reveal-line:not(.visible)').forEach(el => {
        observerRef.current.observe(el)
      })
    })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, deps)
}
