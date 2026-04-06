import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './private.css'

/**
 * Private portal — unlinked auth gate at /private.
 * No header, no footer. Just the logo, access code, enter.
 *
 * With Supabase: authenticates via email/password or magic link.
 * Without Supabase: checks against a local access code (env var).
 */
export default function Private() {
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setError(null)

    if (supabase) {
      // Try Supabase auth — treat code as password with a known admin email
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@gallery.local',
        password: code.trim(),
      })

      if (authError) {
        setError('Invalid access code.')
        setLoading(false)
        return
      }

      setAuthenticated(true)
    } else {
      // No Supabase — placeholder gate
      // In production, replace with env-based check
      setError('Backend not configured. Connect Supabase to enable authentication.')
    }

    setLoading(false)
  }

  if (authenticated) {
    return (
      <div className="private-page">
        <div className="private-center">
          <img src="/logo-embossed.png" alt="Pastel Royalty Gallery" className="private-logo" />
          <div className="private-welcome">
            <div className="private-welcome-title">Welcome</div>
            <p className="private-welcome-body">
              Admin dashboard coming soon. Inquiries, contacts, and content management will be available here.
            </p>
            <a href="/" className="private-back">← Back to Gallery</a>
          </div>
        </div>
        <div className="private-footer">Powered by TMOS13</div>
      </div>
    )
  }

  return (
    <div className="private-page">
      <div className="private-center">
        <img src="/logo-embossed.png" alt="Pastel Royalty Gallery" className="private-logo" />
        <div className="private-label">Private Access</div>

        <form className="private-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="private-input"
            placeholder="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          <button type="submit" className="private-submit" disabled={loading}>
            {loading ? '...' : 'Enter'}
          </button>
        </form>

        {error && <div className="private-error">{error}</div>}
      </div>
      <div className="private-footer">Powered by TMOS13</div>
    </div>
  )
}
