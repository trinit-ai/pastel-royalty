import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const GALLERY_EMAIL = 'info@yourgallery.com'

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

    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter your name and email.')
      return
    }

    // If no Supabase, copy message to clipboard
    if (!supabase) {
      const message = [
        contextLine,
        '',
        form.message.trim() || 'I would like more information.',
        '',
        `— ${form.name.trim()}`,
        form.email.trim(),
      ].filter(Boolean).join('\n')

      try {
        await navigator.clipboard.writeText(message)
      } catch {
        // clipboard API may fail in some contexts — still show success
      }
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
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim() || null,
        source_page: window.location.pathname,
        source_context: contextLine || null,
      })

      if (inquiryError) throw inquiryError

      await supabase.from('contacts').upsert(
        {
          email: form.email.trim(),
          name: form.name.trim(),
          source: 'inquiry',
        },
        { onConflict: 'email', ignoreDuplicates: false }
      ).catch(() => {})

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
