import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * The inquiry form — gallery's revenue conversion point.
 *
 * Design principles:
 * - Feels like writing a note to a gallerist, not a web form
 * - Minimal fields: name, email, message. That's it.
 * - Contextual: knows what artwork/exhibition you're asking about
 * - Confirmation is elegant, not a redirect
 * - Honeypot field for spam (no CAPTCHA — kills the mood)
 */
export default function InquireForm({
  artwork = null,
  exhibition = null,
  compact = false,
  onSuccess,
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '', _hp: '' })
  const [status, setStatus] = useState('idle') // idle → sending → success → error
  const [error, setError] = useState(null)
  const formRef = useRef(null)

  // Build contextual default message
  const contextLine = artwork
    ? `Inquiring about "${artwork.title}" by ${artwork.artistName}`
    : exhibition
    ? `Inquiring about the exhibition "${exhibition.title}"`
    : ''

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot check
    if (form._hp) return

    // Basic validation
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter your name and email.')
      return
    }

    setStatus('sending')
    setError(null)

    try {
      // 1. Insert inquiry
      const { error: inquiryError } = await supabase.from('inquiries').insert({
        artwork_id: artwork?.id || null,
        exhibition_id: exhibition?.id || null,
        artist_id: artwork?.artistId || null,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim() || null,
        source_page: window.location.pathname,
        source_context: contextLine || null,
      })

      if (inquiryError) throw inquiryError

      // 2. Upsert contact (don't fail if this errors)
      await supabase.from('contacts').upsert(
        {
          email: form.email.trim(),
          name: form.name.trim(),
          source: 'inquiry',
        },
        { onConflict: 'email', ignoreDuplicates: false }
      ).catch(() => {}) // silent fail — inquiry is what matters

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
          We've received your inquiry{artwork ? ` about "${artwork.title}"` : ''} and will be in touch shortly.
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

      {/* Honeypot — hidden from humans, visible to bots */}
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
          placeholder={compact ? 'Message (optional)' : 'Tell us what you're looking for...'}
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
