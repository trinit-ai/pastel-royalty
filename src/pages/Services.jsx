import { useScrollReveal } from '../hooks/useScrollReveal'
import { useInquire } from '../hooks/useInquire'

import './services.css'

const SERVICES = [
  {
    id: 'consultations',
    label: 'Consultations',
    title: 'Fine Art Consulting Services',
    body: [
      `Our consulting practice offers personalized guidance for collectors at every stage. Whether you are building a collection from the ground up or refining an established body of work, we bring deep market knowledge and a global network of relationships to every engagement.`,
      `We work closely with private collectors, interior designers, corporate clients, and institutions to identify and acquire works that align with aesthetic vision, investment goals, and long-term curatorial strategy.`,
    ],
    offerings: [
      'Collection building and strategic acquisition planning',
      'Artist and market research',
      'Placement for residential and commercial interiors',
      'Secondary market sourcing and negotiation',
      'Collection management and cataloguing',
    ],
  },
  {
    id: 'appraisals',
    label: 'Appraisals',
    title: 'Fine Art Appraisal Services',
    body: [
      `We offer expert fine art appraisal services designed to meet the needs of both new and seasoned collectors. Our appraisal services are comprehensive, providing accurate and reliable valuations for a wide range of purposes.`,
      `All appraisals are conducted in accordance with the Uniform Standards of Professional Appraisal Practice (USPAP) and prepared by a qualified appraiser with extensive experience in the contemporary and modern art markets.`,
    ],
    offerings: [
      'Insurance coverage and scheduling',
      'Estate planning and equitable distribution',
      'Charitable donation and tax purposes',
      'Damage and loss claims',
      'Fair market value and replacement value assessments',
    ],
  },
  {
    id: 'advisory',
    label: 'Art Advisory',
    title: 'Art Advisory Services',
    body: [
      `For clients seeking an ongoing curatorial partnership, our advisory program provides sustained, relationship-driven guidance. We serve as a trusted extension of your team — offering the expertise, discretion, and access that serious collecting demands.`,
      `Our advisory relationships are built on transparency, deep research, and a genuine commitment to each client's vision. We believe every collection should tell a story, and we help you shape that narrative with intention and care.`,
    ],
    offerings: [
      'Long-term collection strategy and vision development',
      'Art fair and auction representation',
      'Studio visits and artist introductions',
      'Custom commissioning and project management',
      'Trade programs for designers and architects',
    ],
  },
]

export default function Services() {
  useScrollReveal()
  const { openInquire } = useInquire()

  return (
    <main className="services-page">
      {/* Hero */}
      <section className="services-hero reveal">
        <div className="eyebrow">Services</div>
        <h1 className="services-hero-title">Advisory & Appraisal</h1>
        <p className="services-hero-subtitle">
          A full-service practice built on deep expertise, global relationships, and a commitment to every client's vision.
        </p>
      </section>

      {/* Image placeholder carousel */}
      <div className="services-images reveal">
        <div className="services-image-placeholder" style={{ background: 'linear-gradient(160deg, var(--sage), var(--parchment))' }} />
        <div className="services-image-placeholder" style={{ background: 'linear-gradient(160deg, var(--lavender), var(--parchment))' }} />
        <div className="services-image-placeholder" style={{ background: 'linear-gradient(160deg, var(--blush), var(--parchment))' }} />
      </div>

      {/* Service sections */}
      {SERVICES.map((svc, i) => (
        <section key={svc.id} id={svc.id} className="services-section">
          <div className="services-section-inner reveal">
            <div className="services-section-header">
              <div className="eyebrow mb-10">{svc.label}</div>
              <h2 className="services-section-title">{svc.title}</h2>
            </div>
            <div className="services-section-content">
              {svc.body.map((p, j) => (
                <p key={j} className="services-section-body">{p}</p>
              ))}
              <div className="services-offerings">
                {svc.offerings.map((o, j) => (
                  <div key={j} className="services-offering-item">— {o}</div>
                ))}
              </div>
              <a className="services-cta" onClick={openInquire} role="button">Inquire</a>
            </div>
          </div>
          {i < SERVICES.length - 1 && <div className="services-divider" />}
        </section>
      ))}
    </main>
  )
}
