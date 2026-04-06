import { useEffect } from 'react'
import Lenis from 'lenis'
import Snap from 'lenis/snap'

let lenisInstance = null
let snapInstance = null

export function useSmoothScroll() {
  useEffect(() => {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    snapInstance = new Snap(lenisInstance, {
      type: 'proximity',
      debounce: 100,
    })

    // Snap to section headers
    const headers = document.querySelectorAll('.section-header, .hero, .services-hero, .news-header')
    headers.forEach((el) => {
      snapInstance.addElement(el, { align: ['start'] })
    })

    function raf(time) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      snapInstance.destroy()
      snapInstance = null
      lenisInstance.destroy()
      lenisInstance = null
    }
  }, [])
}
