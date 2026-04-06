import './layout.css'

export default function Newsletter() {
  return (
    <div className="newsletter-wrapper">
      <div className="newsletter-guild">
        <span className="newsletter-guild-line" />
        <span className="newsletter-guild-dot" />
        <span className="newsletter-guild-line" />
      </div>
      <div className="newsletter">
        <div className="newsletter-text">Stay informed about exhibitions and events.</div>
        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
          <input type="email" className="newsletter-input" placeholder="Email address" />
          <button type="submit" className="newsletter-submit">Subscribe</button>
        </form>
      </div>
    </div>
  )
}
