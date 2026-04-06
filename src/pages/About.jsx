import { useScrollReveal } from '../hooks/useScrollReveal'

import './about.css'

const GALLERY_DESCRIPTION = [
  `Established in 2022, Pastel Royalty Gallery operates as both a fine art gallery and a full-service art advisory firm. We showcase a thoughtfully curated program of emerging and mid-career artists through year-round exhibitions, while also offering personalized advisory services to private collectors, designers, corporations, and institutions.`,
  `From our space just outside the city, we offer a slower, more intentional way to experience and engage with contemporary art. Our setting encourages clear thinking and meaningful dialogue, making it the ideal place to view, reflect on, and collect art.`,
  `Our advisory practice is built upon deep expertise in contemporary and modern art.`,
]

const SERVICES = [
  'Strategic collection building and management',
  'Appraisals for insurance, estate, and donation purposes',
  'Acquisitions and sales on the primary and secondary markets',
  'Custom commissions and placement for residential and commercial spaces',
]

const STAFF = [
  { name: 'First Last', role: 'Owner / Director' },
  { name: 'First Last', role: 'Gallery Assistant' },
]

export default function About() {
  useScrollReveal()

  return (
    <main className="about-page">
      {/* Split pane: text left, image right */}
      <section className="about-split">
        <div className="about-split-text">
          <div className="eyebrow" style={{ marginBottom: 14 }}>The Gallery</div>
          <h1 className="about-title">About</h1>
          {GALLERY_DESCRIPTION.map((p, i) => (
            <p key={i} className="about-body reveal">{p}</p>
          ))}
          <div className="about-services reveal">
            {SERVICES.map((s, i) => (
              <div key={i} className="about-service-item">— {s}</div>
            ))}
          </div>
          <p className="about-body reveal">
            Whether you're acquiring your first artwork or managing an established collection, we bring deep market knowledge, a global network, and a commitment to fairness and transparency. We also collaborate with interior designers and brands through tailored trade programs. We believe every collecting journey should be thoughtful, inspired, and deeply personal. If you'd like to start a conversation, we'd love to hear from you.
          </p>
        </div>
        <div className="about-split-image">
          <div className="about-hero-image" />
        </div>
      </section>

      {/* Quote */}
      <section className="about-quote reveal">
        <blockquote>
          "The fairest thing we can experience is the mysterious. It is the fundamental emotion which stands at the cradle of true art and true science."
        </blockquote>
        <cite>— Albert Einstein</cite>
      </section>

      {/* Contact grid */}
      <section className="about-contact">
        <h2 className="about-contact-title reveal">Contact</h2>
        <div className="about-contact-rule reveal-line" />
        <div className="about-contact-grid reveal">
          <div className="about-contact-col">
            <div className="about-contact-label">Inquiries</div>
            <div className="about-contact-value">
              <a href="mailto:info@yourgallery.com">info@yourgallery.com</a>
            </div>
            <div className="about-contact-value">
              <a href="tel:+10000000000">(000) 000-0000</a>
            </div>
            <div className="about-submissions">
              The gallery is not currently able to review unsolicited submissions.
            </div>
          </div>

          <div className="about-contact-col">
            <div className="about-contact-label">Staff</div>
            {STAFF.map((s, i) => (
              <div key={i} className="about-staff-entry">
                <div className="about-staff-name">{s.name}</div>
                <div className="about-staff-role">{s.role}</div>
              </div>
            ))}
          </div>

          <div className="about-contact-col">
            <div className="about-contact-label">Location & Hours</div>
            <div className="about-contact-value">
              123 Main Street<br />
              Your City, ST 00000
            </div>
            <div className="about-contact-value" style={{ marginTop: 16 }}>
              Thursday – Sunday: 11 – 5 pm<br />
              Monday & Tuesday by appointment
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
