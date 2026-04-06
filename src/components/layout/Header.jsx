import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './layout.css'

const NAV_ITEMS = [
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'Artists', to: '/artists' },
  { label: 'News', to: '/news' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
]

const TICKER_ITEMS = [
  { label: 'Now on view', value: 'Still Life with Light' },
  { label: 'Hours', value: 'Thu–Sun, 11–5' },
  { label: 'Location', value: 'Your City, ST' },
  { label: 'Phone', value: '(555) 000-0000' },
  { label: 'Email', value: 'info@yourgallery.com' },
]

export default function Header({ galleryName = 'Pastel Royalty Gallery' }) {
  const location = useLocation()
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  )
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    setTheme(next)
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">{galleryName}</Link>

        {/* Desktop nav */}
        <nav className="header-nav header-nav-desktop">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`header-nav-link ${location.pathname === item.to || location.pathname.startsWith(item.to + '/') ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <button
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
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

        {/* Mobile hamburger */}
        <button
          className={`header-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-menu-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-menu-link ${location.pathname === item.to ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-menu-info">
            {TICKER_ITEMS.map((item, i) => (
              <div key={i} className="mobile-menu-info-row">
                <span className="mobile-menu-info-label">{item.label}</span>
                <span className="mobile-menu-info-value">{item.value}</span>
              </div>
            ))}
          </div>

          <button
            className={`theme-toggle ${theme}`}
            onClick={toggleTheme}
            style={{ marginTop: 'auto' }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <svg className="theme-icon theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg className="theme-icon theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
