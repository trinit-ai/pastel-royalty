import { useState } from 'react'
import './layout.css'

const NAV_ITEMS = [
  { label: 'Exhibitions', href: '#exhibitions' },
  { label: 'Artists', href: '#artists' },
  { label: 'About', href: '#about' },
  { label: 'Visit', href: '#visit' },
]

export default function Header({ galleryName = 'Gallery Name' }) {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'dark'
  )

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
  }

  return (
    <header className="header">
      <a href="/" className="header-logo">{galleryName}</a>
      <nav className="header-nav">
        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href} className="header-nav-link">
            {item.label}
          </a>
        ))}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '○' : '●'}
        </button>
      </nav>
    </header>
  )
}
