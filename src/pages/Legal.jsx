import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './legal.css'

const GALLERY_NAME = 'Pastel Royalty Gallery'
const GALLERY_EMAIL = 'info@yourgallery.com'
const GALLERY_ADDRESS = '123 Main Street, Suite #1, Your City, ST 00000'
const EFFECTIVE_DATE = 'January 1, 2025'

const PAGES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: EFFECTIVE_DATE,
    sections: [
      {
        heading: 'Introduction',
        body: `${GALLERY_NAME} ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, attend our exhibitions, or engage with our services.`,
      },
      {
        heading: 'Information We Collect',
        body: `We may collect personal information that you voluntarily provide when you:\n\n— Submit an inquiry about an artwork or exhibition\n— Subscribe to our newsletter\n— Request an appraisal or advisory consultation\n— Register for an exhibition opening or event\n— Contact us via email, phone, or our website\n\nThis information may include your name, email address, phone number, mailing address, and details about your collecting interests.`,
      },
      {
        heading: 'How We Use Your Information',
        body: `We use the information we collect to:\n\n— Respond to your inquiries about artworks, exhibitions, and services\n— Send you exhibition announcements, newsletters, and event invitations\n— Facilitate appraisals, advisory services, and artwork transactions\n— Improve our website and tailor our services to your interests\n— Comply with legal obligations and protect our rights`,
      },
      {
        heading: 'Information Sharing',
        body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, provided they agree to keep this information confidential. We may also share information when required by law or to protect our rights.`,
      },
      {
        heading: 'Data Security',
        body: `We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.`,
      },
      {
        heading: 'Your Rights',
        body: `You may request access to, correction of, or deletion of your personal information at any time. You may also opt out of receiving marketing communications by following the unsubscribe instructions in our emails or by contacting us directly.`,
      },
      {
        heading: 'Contact',
        body: `If you have questions about this Privacy Policy or your personal information, please contact us at ${GALLERY_EMAIL}.`,
      },
    ],
  },

  'terms-of-use': {
    title: 'Terms of Use',
    eyebrow: 'Legal',
    lastUpdated: EFFECTIVE_DATE,
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: `By accessing and using this website, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.`,
      },
      {
        heading: 'Intellectual Property',
        body: `All content on this website — including text, images, photographs of artworks, logos, and design elements — is the property of ${GALLERY_NAME} or its represented artists and is protected by copyright and intellectual property laws.\n\nImages of artworks are reproduced with the permission of the artists or their estates. You may not reproduce, distribute, modify, or create derivative works from any content on this website without prior written permission.`,
      },
      {
        heading: 'Use of the Website',
        body: `You may use this website for personal, non-commercial purposes only. You agree not to:\n\n— Reproduce or download images of artworks for any commercial purpose\n— Use automated systems to access or scrape content from the website\n— Misrepresent your identity or affiliation when making inquiries\n— Interfere with the proper functioning of the website`,
      },
      {
        heading: 'Artwork Inquiries & Transactions',
        body: `Information about artworks displayed on this website — including availability, pricing, and descriptions — is provided for informational purposes and is subject to change. Listing an artwork on the website does not constitute an offer to sell. All transactions are subject to separate agreements between the buyer, the gallery, and the artist.`,
      },
      {
        heading: 'Disclaimer of Warranties',
        body: `This website is provided on an "as is" and "as available" basis. ${GALLERY_NAME} makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of the information provided. We do not guarantee uninterrupted or error-free access to the website.`,
      },
      {
        heading: 'Limitation of Liability',
        body: `${GALLERY_NAME} shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of or inability to use this website or any content therein.`,
      },
      {
        heading: 'Governing Law',
        body: `These Terms of Use are governed by the laws of the state in which ${GALLERY_NAME} operates. Any disputes arising from these terms shall be resolved in the appropriate courts of that jurisdiction.`,
      },
      {
        heading: 'Contact',
        body: `Questions about these Terms of Use may be directed to ${GALLERY_EMAIL}.`,
      },
    ],
  },

  'cookie-policy': {
    title: 'Cookie Policy',
    eyebrow: 'Legal',
    lastUpdated: EFFECTIVE_DATE,
    sections: [
      {
        heading: 'What Are Cookies',
        body: `Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember certain information about your visit, such as your preferences and browsing activity.`,
      },
      {
        heading: 'How We Use Cookies',
        body: `${GALLERY_NAME} uses cookies to:\n\n— Ensure the website functions properly (essential cookies)\n— Remember your preferences, such as theme settings (functional cookies)\n— Understand how visitors use our website through analytics (analytics cookies)\n— Measure the effectiveness of our exhibition announcements and communications (performance cookies)`,
      },
      {
        heading: 'Types of Cookies We Use',
        body: `Essential Cookies — Required for the website to function. These cannot be disabled.\n\nFunctional Cookies — Remember your settings and preferences (e.g., light/dark theme).\n\nAnalytics Cookies — Help us understand how visitors interact with our website. We use privacy-respecting analytics that do not track you across other websites.\n\nNo advertising or third-party tracking cookies are used on this website.`,
      },
      {
        heading: 'Managing Cookies',
        body: `Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, though this may affect your experience on our website. For more information on managing cookies, consult your browser's help documentation.`,
      },
      {
        heading: 'Contact',
        body: `If you have questions about our use of cookies, please contact us at ${GALLERY_EMAIL}.`,
      },
    ],
  },

  'accessibility': {
    title: 'Accessibility Statement',
    eyebrow: 'Commitment',
    lastUpdated: EFFECTIVE_DATE,
    sections: [
      {
        heading: 'Our Commitment',
        body: `${GALLERY_NAME} is committed to ensuring that our website and physical gallery space are accessible to all visitors, including those with disabilities. We believe that art should be experienced by everyone, and we continually work to improve the accessibility and usability of our digital and physical environments.`,
      },
      {
        heading: 'Website Accessibility',
        body: `We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. Our ongoing accessibility efforts include:\n\n— Semantic HTML and proper heading structure for screen reader compatibility\n— Descriptive alt text for artwork images\n— Keyboard-navigable interface elements\n— Sufficient color contrast ratios throughout the design\n— Responsive design that adapts to different devices and screen sizes\n— ARIA labels on interactive elements such as our lightbox and navigation`,
      },
      {
        heading: 'Gallery Accessibility',
        body: `Our physical gallery space is wheelchair accessible and offers:\n\n— Step-free ground floor access\n— Accessible restrooms\n— Seating available upon request\n— Large-print exhibition materials available upon request\n— Service animals welcome\n\nIf you require any accommodations for your visit, please contact us in advance and we will do our best to assist you.`,
      },
      {
        heading: 'Feedback',
        body: `We welcome your feedback on the accessibility of the ${GALLERY_NAME} website and gallery. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:\n\nEmail: ${GALLERY_EMAIL}\nPhone: (555) 000-0000\nAddress: ${GALLERY_ADDRESS}\n\nWe aim to respond to accessibility feedback within two business days.`,
      },
      {
        heading: 'Third-Party Content',
        body: `While we strive to ensure accessibility throughout our website, some third-party content or services integrated into our site may not be fully accessible. We are committed to working with our vendors to improve accessibility wherever possible.`,
      },
    ],
  },
}

export default function Legal() {
  const { slug } = useParams()
  useScrollReveal([slug])

  const page = PAGES[slug]
  if (!page) {
    return (
      <main className="legal-page">
        <div className="legal-content">
          <Link to="/" className="legal-back">← Home</Link>
          <h1 className="legal-title">Page not found</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="legal-page">
      <div className="legal-content">
        <div className="legal-eyebrow reveal">{page.eyebrow}</div>
        <h1 className="legal-title reveal">{page.title}</h1>
        <div className="legal-updated reveal">Last updated: {page.lastUpdated}</div>

        {page.sections.map((section, i) => (
          <section key={i} className={`legal-section reveal ${i > 0 ? 'reveal-delay-1' : ''}`}>
            <h2 className="legal-section-title">{section.heading}</h2>
            {section.body.split('\n\n').map((para, j) => (
              <p key={j} className="legal-body">{para}</p>
            ))}
          </section>
        ))}

        <div className="legal-back-bottom reveal">
          <Link to="/" className="legal-back-link">← Back to Gallery</Link>
        </div>
      </div>
    </main>
  )
}
