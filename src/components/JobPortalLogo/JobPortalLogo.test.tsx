import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { JOB_PORTAL_LOGO_TYPES, JobPortalLogo, jobPortalLogoTypeFromChannel } from './JobPortalLogo'

describe('JobPortalLogo', () => {
  it('renders a known portal logo with an accessible name', () => {
    render(<JobPortalLogo type="jobs-cz" />)

    const logo = screen.getByRole('img', { name: 'Jobs.cz' })
    expect(logo).toHaveAttribute('data-testid', 'job-portal-logo')
    expect(logo).toHaveAttribute('data-logo-type', 'jobs-cz')
    expect(logo).not.toHaveAttribute('data-logo-fallback')
    expect(logo.querySelector('img')).toHaveAttribute('src')
  })

  it('uses a deterministic fallback for unknown types', () => {
    render(<JobPortalLogo type="unknown-portal" />)

    const logo = screen.getByTestId('job-portal-logo')
    expect(logo).toHaveAttribute('data-logo-type', 'unknown-portal')
    expect(logo).toHaveAttribute('data-logo-fallback', 'true')
    expect(logo.querySelector('img')).toBeTruthy()
  })

  it('can be rendered as decorative', () => {
    render(<JobPortalLogo type="prace-cz" title="" />)

    const logo = screen.getByTestId('job-portal-logo')
    expect(logo).toHaveAttribute('aria-hidden', 'true')
    expect(logo).not.toHaveAttribute('role')
    expect(logo.querySelector('img')).toHaveAttribute('alt', '')
    expect(logo.querySelector('img')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards ref and className', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<JobPortalLogo ref={ref} type="atmoskop" className="tm-size-8" />)

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveClass('tm-size-8')
  })

  it('exposes every Figma portal type', () => {
    expect(JOB_PORTAL_LOGO_TYPES).toEqual([
      'atmoskop',
      'export',
      'jobs-cz',
      'jobs-cz-prace-cz',
      'pages',
      'prace-cz',
      'prace-za-rohem',
      'profesia',
      'recommend',
      'sections',
      'teamio',
    ])
  })

  it('maps publication channel names to logo types', () => {
    expect(jobPortalLogoTypeFromChannel('Jobs.cz')).toBe('jobs-cz')
    expect(jobPortalLogoTypeFromChannel('Prace.cz')).toBe('prace-cz')
    expect(jobPortalLogoTypeFromChannel('Kariérní stránky')).toBe('pages')
    expect(jobPortalLogoTypeFromChannel('Atmoskop')).toBe('atmoskop')
    expect(jobPortalLogoTypeFromChannel('Profesia')).toBe('profesia')
    expect(jobPortalLogoTypeFromChannel('Práce za rohem')).toBe('prace-za-rohem')
    expect(jobPortalLogoTypeFromChannel('Teamio')).toBe('teamio')
    expect(jobPortalLogoTypeFromChannel('Neznámý kanál')).toBe('sections')
  })
})
