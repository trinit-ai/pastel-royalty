import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './news.css'

/**
 * Generic news detail page — fallback for items without external links.
 * In production, content would come from Supabase page_content table.
 */
export default function NewsDetail() {
  const { slug } = useParams()
  useScrollReveal([slug])

  // Convert slug back to readable title
  const title = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <main className="news-detail-page">
      <div className="news-detail-content">
        <Link to="/news" className="news-detail-back reveal">← News</Link>
        <div className="news-detail-eyebrow reveal">Gallery</div>
        <h1 className="news-detail-title reveal">{title}</h1>
        <div className="news-detail-divider reveal-line" />
        <div className="news-detail-body reveal">
          <p>Further details about this event will be announced soon. For inquiries, please contact the gallery directly.</p>
          <p>We look forward to sharing more information with you.</p>
        </div>
        <div className="news-detail-contact reveal">
          <div className="news-detail-contact-label">Contact</div>
          <div className="news-detail-contact-value">
            <a href="mailto:info@yourgallery.com">info@yourgallery.com</a>
          </div>
          <div className="news-detail-contact-value">
            <a href="tel:+15550000000">(555) 000-0000</a>
          </div>
        </div>
      </div>
    </main>
  )
}
