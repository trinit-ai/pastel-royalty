import { MemoryRouter } from 'react-router-dom'
import { LightboxProvider } from '../hooks/useLightbox'
import { InquireProvider } from '../hooks/useInquire'

/**
 * Wrap a component in all the providers it needs to render.
 * Use `route` to set the initial URL.
 */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <InquireProvider>
        <LightboxProvider>
          {ui}
        </LightboxProvider>
      </InquireProvider>
    </MemoryRouter>
  )
}
