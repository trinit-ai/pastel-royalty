import './layout.css'

export default function Footer({ galleryName = 'Gallery Name' }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <div className="footer-gallery-name">{galleryName}</div>
          <div className="footer-col-text" style={{ marginBottom: 16 }}>
            Contemporary painting, sculpture, and works on paper.
          </div>
          <div className="footer-col-text">
            123 Main Street, Suite #1<br />
            Your City, ST 00000<br /><br />
            Thursday – Sunday, 11am – 5pm<br />
            And by appointment
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Navigate</div>
          <nav className="footer-nav">
            <a href="#exhibitions">Exhibitions</a>
            <a href="#artists">Artists</a>
            <a href="#about">About</a>
            <a href="#visit">Visit</a>
            <a href="mailto:info@gallery.com">Inquire</a>
          </nav>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Legal</div>
          <nav className="footer-nav">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </nav>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Connect</div>
          <div className="footer-col-text">
            <a href="mailto:info@yourgallery.com">info@yourgallery.com</a><br />
            <a href="tel:5550000000">(555) 000-0000</a><br /><br />
            <a href="#">Instagram</a><br />
            <a href="#">Facebook</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left serif">{galleryName} · Your City, ST · Est. 2024</div>
        <div className="footer-bottom-right">&copy; {new Date().getFullYear()} {galleryName} LLC</div>
      </div>
    </footer>
  )
}
