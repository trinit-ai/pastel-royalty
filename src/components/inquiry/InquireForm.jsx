import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const GALLERY_EMAIL = 'info@yourgallery.com'
const RATE_LIMIT_KEY = 'pr_inquiry_ts'
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

/** Strip HTML tags and trim whitespace */
function sanitize(str) {
  return str.replace(/<[^>]*>/g, '').trim()
}

/** Check client-side rate limit — returns true if blocked */
function isRateLimited() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    const timestamps = raw ? JSON.parse(raw) : []
    const now = Date.now()
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
    return recent.length >= RATE_LIMIT_MAX
  } catch { return false }
}

/** Record a submission timestamp */
function recordSubmission() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    const timestamps = raw ? JSON.parse(raw) : []
    const now = Date.now()
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
    recent.push(now)
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent))
  } catch { /* localStorage unavailable */ }
}

/**
 * The inquiry form — gallery's revenue conversion point.
 *
 * Two modes:
 * - With Supabase: saves to DB, upserts contact, shows confirmation
 * - Without Supabase: opens mailto with pre-filled subject/body
 *
 * Design: feels like writing a note to a gallerist, not a web form.
 * Minimal fields. Honeypot for spam. No CAPTCHA.
 */
export default function InquireForm({
  artwork = null,
  exhibition = null,
  compact = false,
  onSuccess,
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '', _hp: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const formRef = useRef(null)

  const contextLine = artwork
    ? `Inquiring about "${artwork.title}" by ${artwork.artistName}`
    : exhibition
    ? `Inquiring about the exhibition "${exhibition.title}"`
    : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form._hp) return

    const cleanName = sanitize(form.name)
    const cleanEmail = sanitize(form.email)
    const cleanMessage = sanitize(form.message)

    if (!cleanName || !cleanEmail) {
      setError('Please enter your name and email.')
      return
    }

    if (isRateLimited()) {
      setError('Too many inquiries. Please try again later or email us directly.')
      return
    }

    // If no Supabase, copy message to clipboard
    if (!supabase) {
      const message = [
        contextLine,
        '',
        cleanMessage || 'I would like more information.',
        '',
        `— ${cleanName}`,
        cleanEmail,
      ].filter(Boolean).join('\n')

      try {
        await navigator.clipboard.writeText(message)
      } catch { /* clipboard unavailable */ }
      recordSubmission()
      setStatus('success')
      onSuccess?.()
      return
    }

    setStatus('sending')
    setError(null)

    try {
      const { error: inquiryError } = await supabase.from('inquiries').insert({
        artwork_id: artwork?.id || null,
        exhibition_id: exhibition?.id || null,
        artist_id: artwork?.artistId || null,
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage || null,
        source_page: window.location.pathname,
        source_context: contextLine || null,
      })

      if (inquiryError) throw inquiryError

      await supabase.from('contacts').upsert(
        {
          email: cleanEmail,
          name: cleanName,
          source: 'inquiry',
        },
        { onConflict: 'email', ignoreDuplicates: false }
      ).catch(() => {})

      recordSubmission()
      setStatus('success')
      onSuccess?.()
    } catch (err) {
      console.error('Inquiry submission error:', err)
      setStatus('error')
      setError('Something went wrong. Please email us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`inquire-success ${compact ? 'compact' : ''}`}>
        <div className="inquire-success-title">Thank you.</div>
        <p className="inquire-success-body">
          {supabase
            ? `We've received your inquiry${artwork ? ` about "${artwork.title}"` : ''} and will be in touch shortly.`
            : `Your message has been copied to clipboard. Please email ${GALLERY_EMAIL} to send it.`}
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      className={`inquire-form ${compact ? 'compact' : ''}`}
      onSubmit={handleSubmit}
    >
      {!compact && (
        <div className="inquire-form-header">
          <h3 className="inquire-form-title">
            {artwork ? 'Inquire About This Work' : exhibition ? 'Inquire About This Exhibition' : 'Get in Touch'}
          </h3>
          {contextLine && (
            <p className="inquire-form-context">{contextLine}</p>
          )}
        </div>
      )}

      <input
        type="text"
        name="_hp"
        value={form._hp}
        onChange={(e) => setForm(prev => ({ ...prev, _hp: e.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        aria-hidden="true"
      />

      <div className="inquire-fields">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          required
          className="inquire-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
          required
          className="inquire-input"
        />
        <textarea
          placeholder={compact ? 'Message (optional)' : 'Tell us what you\'re looking for...'}
          value={form.message}
          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
          className="inquire-textarea"
          rows={compact ? 3 : 4}
        />
      </div>

      {error && <div className="inquire-error">{error}</div>}

      <button
        type="submit"
        className="inquire-submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Inquiry →'}
      </button>
    </form>
  )
}
