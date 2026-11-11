import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'

describe('AdvertisementEmptyState', () => {
  it('renders promotional copy and a publish CTA without the advertisement icon', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    render(<AdvertisementEmptyState onCreateAdvertisement={onCreateAdvertisement} />)

    const root = screen.getByTestId('job-card-no-advertisement')
    const publish = within(root).getByRole('button', { name: 'Vystavit inzerát' })

    expect(within(root).queryByTestId('job-card-advertisement-empty-icon')).not.toBeInTheDocument()
    expect(within(root).queryByTestId('icon')).not.toBeInTheDocument()
    expect(within(root).queryByTestId('job-card-advertisement-empty-label')).not.toBeInTheDocument()
    expect(root).not.toHaveTextContent('Zatím nevystavený inzerát')
    expect(root).toHaveTextContent('Zatím neinzerujete')
    expect(root).toHaveTextContent(
      'Relevantní kandidáti z našich portálů se na inzerát ozvou rychle.',
    )
    expect(root.className).toContain('tm-bg-emotion-info-background')
    expect(root.className).toContain('tm-grid-cols-[minmax(0,1fr)_auto]')
    expect(root.className).toContain('md:tm-grid-cols-1')
    expect(within(root).getByTestId('job-card-advertisement-empty-title').className).toContain(
      'tm-text-sm',
    )
    expect(within(root).getByTestId('job-card-advertisement-empty-title').className).not.toContain(
      'tm-text-base',
    )
    expect(publish).toHaveClass('tm-bg-action-primary-default')
    expect(publish).toHaveClass('tm-min-h-8')
    expect(publish).not.toHaveClass('tm-min-h-10')
    expect(publish.className).toContain('tm-col-start-2')
    expect(publish.className).not.toContain('tm-col-start-3')
    expect(publish.className).toContain('md:tm-w-full')
    expect(publish.className).not.toMatch(/(?:^|\s)tm-w-full(?:\s|$)/)

    await user.click(publish)
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('omits portal chips and the Přehled link', () => {
    render(<AdvertisementEmptyState onCreateAdvertisement={vi.fn()} />)

    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
    expect(screen.queryByText('Prace.cz')).not.toBeInTheDocument()
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()
    expect(screen.queryByText('Detailní přehled')).not.toBeInTheDocument()
    expect(screen.queryByText('Vytvořit inzerát')).not.toBeInTheDocument()
  })

  it('hides the publish button when no handler is provided', () => {
    render(<AdvertisementEmptyState />)

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Zatím neinzerujete',
    )
    expect(screen.queryByTestId('job-card-advertisement-empty-label')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-empty-icon')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Vystavit inzerát' })).not.toBeInTheDocument()
  })
})
