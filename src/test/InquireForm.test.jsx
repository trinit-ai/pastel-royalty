import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InquireForm from '../components/inquiry/InquireForm'

describe('InquireForm', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders name, email, message inputs and a submit button', () => {
    render(<InquireForm />)
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/looking for/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('shows artwork context line when artwork is passed', () => {
    render(
      <InquireForm
        artwork={{ title: 'Camellias I', artistName: 'Rob Ventura' }}
      />
    )
    expect(screen.getAllByText(/Camellias I/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Rob Ventura/).length).toBeGreaterThan(0)
  })

  it('shows exhibition context line when exhibition is passed', () => {
    render(
      <InquireForm
        exhibition={{ title: 'Still Life with Light' }}
      />
    )
    expect(screen.getAllByText(/Still Life with Light/).length).toBeGreaterThan(0)
  })

  it('blocks submission after rate limit is hit', async () => {
    // Pre-fill localStorage with 5 recent timestamps
    const now = Date.now()
    const timestamps = [now, now - 1000, now - 2000, now - 3000, now - 4000]
    window.localStorage.setItem('pr_inquiry_ts', JSON.stringify(timestamps))

    const user = userEvent.setup()
    render(<InquireForm />)
    await user.type(screen.getByPlaceholderText('Name'), 'Test User')
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/looking for/i), 'Hello')
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(screen.getByText(/too many inquiries/i)).toBeInTheDocument()
  })

  it('honeypot blocks submission silently', async () => {
    const user = userEvent.setup()
    const { container } = render(<InquireForm />)
    await user.type(screen.getByPlaceholderText(/name/i), 'Bot')
    await user.type(screen.getByPlaceholderText(/email/i), 'bot@spam.com')

    // Find honeypot field (hidden _hp input)
    const honeypot = container.querySelector('input[name="_hp"]')
    if (honeypot) {
      fireEvent.change(honeypot, { target: { value: 'spam-content' } })
    }

    await user.click(screen.getByRole('button', { name: /send|inquire|submit/i }))
    // Should not show error or success — silently rejected
    expect(screen.queryByText(/please enter/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument()
  })
})
