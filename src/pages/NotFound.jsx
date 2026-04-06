import { Link } from 'react-router-dom'
import './not-found.css'

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-body">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="not-found-link">← Back to Gallery</Link>
      </div>
    </main>
  )
}
