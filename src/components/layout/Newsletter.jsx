import './layout.css'

export default function Newsletter() {
  return (
    <div className="newsletter">
      <div className="newsletter-text">Stay informed about exhibitions and events.</div>
      <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
        <input type="email" className="newsletter-input" placeholder="Email address" />
        <button type="submit" className="newsletter-submit">Subscribe</button>
      </form>
    </div>
  )
}
