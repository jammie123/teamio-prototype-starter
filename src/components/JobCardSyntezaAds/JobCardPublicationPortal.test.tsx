import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JobCardPublicationPortal } from './JobCardPublicationPortal'
import type { JobPublication } from '../JobCardSynteza/types'

function publication(channel: string): JobPublication {
  return {
    id: channel,
    channel,
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
  }
}

describe('JobCardPublicationPortal', () => {
  it('renders Jobs.cz and Prace.cz in regular weight with an 18px portal logo', () => {
    const { rerender } = render(
      <JobCardPublicationPortal publication={publication('Jobs.cz')} expired={false} withSeparator={false} />,
    )

    const jobs = screen.getByTestId('job-card-publication-channel')
    expect(jobs).toHaveTextContent('Jobs.cz')
    expect(jobs).toHaveClass('tm-font-normal')
    expect(jobs).not.toHaveClass('tm-font-medium')
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveClass('tm-size-[18px]')
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveAttribute('data-logo-type', 'jobs-cz')

    rerender(
      <JobCardPublicationPortal publication={publication('Prace.cz')} expired={false} withSeparator={false} />,
    )

    expect(screen.getByTestId('job-card-publication-channel')).toHaveTextContent('Prace.cz')
    expect(screen.getByTestId('job-card-publication-channel')).toHaveClass('tm-font-normal')
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveAttribute('data-logo-type', 'prace-cz')
  })

  it('renders a complementary portal as regular text plus an 18px logo', () => {
    render(
      <JobCardPublicationPortal
        publication={publication('Kariérní stránky')}
        expired={false}
        withSeparator={false}
      />,
    )

    const channel = screen.getByTestId('job-card-publication-channel')
    expect(channel).toHaveTextContent('Kariérní stránky')
    expect(channel).toHaveClass('tm-font-normal')
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveClass('tm-size-[18px]')
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveAttribute('data-logo-type', 'pages')
  })

  it('can render a 24px logo without a channel label and exposes aria-label', () => {
    render(
      <JobCardPublicationPortal
        publication={publication('Jobs.cz')}
        expired={false}
        withSeparator={false}
        channelLogoSize={24}
        showChannelLabel={false}
        inlineHighlights="none"
      />,
    )

    expect(screen.queryByTestId('job-card-publication-channel')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-channel-logo')).toHaveClass('tm-size-[24px]')
    expect(screen.getByTestId('job-card-publication-channel-logo').closest('[role="button"]')).toHaveAttribute(
      'aria-label',
      'Jobs.cz',
    )
  })
})
