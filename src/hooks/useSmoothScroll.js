import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Snap from 'lenis/snap'

let lenisInstance = null
let snapInstance = null
let rafId = null

const SNAP_SELECTORS = [
  '.section-header',
  '.hero',
  '.services-hero',
  '.news-header',
  '.atd-section-title',
  '.exd-section-title',
  '.about-header',
].join(', ')

function rebuildSnap() {
  if (snapInstance) {
    snapInstance.destroy()
    snapInstance = null
  }
  if (!lenisInstance) return

  snapInstance = new Snap(lenisInstance, {
    type: 'proximity',
    debounce: 100,
  })

  const headers = document.querySelectorAll(SNAP_SELECTORS)
  headers.forEach((el) => {
    snapInstance.addElement(el, { align: ['start'] })
  })
}

export function useSmoothScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenisInstance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      if (snapInstance) { snapInstance.destroy(); snapInstance = null }
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      lenisInstance = null
    }
  }, [])

  // Rebuild snap points on every route change
  useEffect(() => {
    // Small delay to let the new page render
    const timer = setTimeout(rebuildSnap, 100)
    return () => clearTimeout(timer)
  }, [pathname])
}
