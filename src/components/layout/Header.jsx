import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './layout.css'

const NAV_ITEMS = [
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'Artists', to: '/#artists' },
  { label: 'About', to: '/#about' },
  { label: 'Visit', to: '/#visit' },
]

export default function Header({ galleryName = 'Pastel Royalty Gallery' }) {
  const location = useLocation()
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
  }

  const handleNavClick = (e, item) => {
    // If it's a hash link on the homepage, scroll to it
    if (item.to.startsWith('/#') && location.pathname === '/') {
      e.preventDefault()
      const el = document.querySelector(item.to.replace('/', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header">
      <Link to="/" className="header-logo">{galleryName}</Link>
      <nav className="header-nav">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`header-nav-link ${location.pathname === item.to ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, item)}
          >
            {item.label}
          </Link>
        ))}
        <button
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <svg className="theme-icon theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg className="theme-icon theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </nav>
    </header>
  )
}
