/**
 * Edge function: Handle new inquiry.
 *
 * Triggered by Supabase webhook on inquiries insert.
 * Sends notification email to gallery via Resend.
 * Creates/updates contact record.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const GALLERY_EMAIL = Deno.env.get('GALLERY_EMAIL')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const payload = await req.json()
    const inquiry = payload.record

    // Fetch artwork details if present
    let artworkInfo = ''
    if (inquiry.artwork_id) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
      const { data: artwork } = await supabase
        .from('artworks')
        .select('title, medium, dimensions, artist:artists(name)')
        .eq('id', inquiry.artwork_id)
        .single()

      if (artwork) {
        artworkInfo = `
          <div style="background:#f8f8f8;padding:16px;margin:16px 0;border-left:3px solid #336699;">
            <strong>${artwork.title}</strong><br/>
            ${artwork.artist?.name || 'Unknown artist'}<br/>
            ${artwork.medium || ''}<br/>
            ${artwork.dimensions || ''}
          </div>
        `
      }
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('GALLERY_FROM_EMAIL') || `Gallery <noreply@${GALLERY_EMAIL.split('@')[1]}>`,
        to: [GALLERY_EMAIL],
        subject: inquiry.source_context || `New inquiry from ${inquiry.name}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;">
            <h2 style="font-weight:400;color:#1a1814;">New Inquiry</h2>

            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr>
                <td style="padding:8px 16px 8px 0;color:#7a7670;font-size:13px;vertical-align:top;">Name</td>
                <td style="padding:8px 0;font-size:14px;">${inquiry.name}</td>
              </tr>
              <tr>
                <td style="padding:8px 16px 8px 0;color:#7a7670;font-size:13px;vertical-align:top;">Email</td>
                <td style="padding:8px 0;font-size:14px;">
                  <a href="mailto:${inquiry.email}" style="color:#336699;">${inquiry.email}</a>
                </td>
              </tr>
              ${inquiry.phone ? `
              <tr>
                <td style="padding:8px 16px 8px 0;color:#7a7670;font-size:13px;vertical-align:top;">Phone</td>
                <td style="padding:8px 0;font-size:14px;">${inquiry.phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding:8px 16px 8px 0;color:#7a7670;font-size:13px;vertical-align:top;">Page</td>
                <td style="padding:8px 0;font-size:14px;color:#7a7670;">${inquiry.source_page || 'Unknown'}</td>
              </tr>
            </table>

            ${artworkInfo}

            ${inquiry.message ? `
              <div style="margin:16px 0;padding:16px 0;border-top:1px solid #e2ded8;">
                <div style="color:#7a7670;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Message</div>
                <div style="font-size:14px;line-height:1.6;color:#1a1814;">${inquiry.message}</div>
              </div>
            ` : ''}

            <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2ded8;">
              <a href="mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.source_context || 'Your inquiry')}"
                 style="display:inline-block;padding:12px 24px;background:#336699;color:white;text-decoration:none;font-size:13px;letter-spacing:0.05em;">
                Reply to ${inquiry.name} →
              </a>
            </div>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const err = await emailResponse.text()
      console.error('Resend error:', err)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Handle inquiry error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
