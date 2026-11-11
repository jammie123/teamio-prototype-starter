import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'

describe('AdvertisementEmptyState', () => {
  it('renders promotional copy with preview and publish buttons', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    const onAdvertisementPreviewClick = vi.fn()
    render(
      <AdvertisementEmptyState
        onCreateAdvertisement={onCreateAdvertisement}
        onAdvertisementPreviewClick={onAdvertisementPreviewClick}
      />,
    )

    const root = screen.getByTestId('job-card-no-advertisement')
    const actions = within(root).getByTestId('job-card-advertisement-empty-actions')
    const preview = within(actions).getByRole('button', { name: 'Zobrazit náhled' })
    const publish = within(actions).getByRole('button', { name: 'Publikovat' })

    expect(within(root).queryByTestId('job-card-advertisement-empty-icon')).not.toBeInTheDocument()
    expect(within(root).queryByTestId('icon')).not.toBeInTheDocument()
    expect(within(root).queryByTestId('job-card-advertisement-empty-label')).not.toBeInTheDocument()
    expect(root).not.toHaveTextContent('Zatím nevystavený inzerát')
    expect(root).toHaveTextContent('Zatím neinzerujete')
    expect(root).toHaveTextContent('Zkontrolujte náhled a publikujte. Kandidáti se ozvou rychle.')
    expect(root).not.toHaveTextContent(
      'Mrkněte, jak by váš inzerát vypadal. Relevantní kandidáti z našich portálů se pak ozvou rychle.',
    )
    expect(root.className).toContain('tm-bg-none')
    expect(root.className).not.toContain('tm-bg-emotion-info-background')
    expect(root.className).toContain('tm-grid-cols-[minmax(0,1fr)_auto]')
    expect(root.className).toContain('md:tm-grid-cols-1')
    expect(within(root).getByTestId('job-card-advertisement-empty-title').className).toContain(
      'tm-text-sm',
    )
    expect(within(root).getByTestId('job-card-advertisement-empty-title').className).not.toContain(
      'tm-text-base',
    )
    expect(actions.className).toContain('tm-col-start-2')
    expect(actions.className).not.toContain('tm-col-start-3')
    expect(actions.className).toContain('tm-flex-row')
    expect(actions.className).not.toContain('tm-flex-col')
    expect(actions.className).toContain('md:tm-w-full')
    expect(preview).toHaveClass('tm-bg-basic')
    expect(preview).toHaveClass('tm-border-action-secondary-default')
    expect(preview).toHaveClass('tm-min-h-8')
    expect(preview.className).not.toContain('md:tm-w-full')
    expect(publish).toHaveClass('tm-bg-action-primary-default')
    expect(publish).toHaveClass('tm-min-h-8')
    expect(publish).not.toHaveClass('tm-min-h-10')
    expect(publish.className).not.toContain('md:tm-w-full')
    expect(preview.compareDocumentPosition(publish) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(preview)
    await user.click(publish)
    expect(onAdvertisementPreviewClick).toHaveBeenCalledOnce()
    expect(onCreateAdvertisement).toHaveBeenCalledOnce()
  })

  it('omits portal chips and the Přehled link', () => {
    render(
      <AdvertisementEmptyState
        onCreateAdvertisement={vi.fn()}
        onAdvertisementPreviewClick={vi.fn()}
      />,
    )

    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
    expect(screen.queryByText('Prace.cz')).not.toBeInTheDocument()
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument()
    expect(screen.queryByText('Přehled')).not.toBeInTheDocument()
    expect(screen.queryByText('Vytvořit inzerát')).not.toBeInTheDocument()
    expect(screen.queryByText('Vystavit inzerát')).not.toBeInTheDocument()
  })

  it('still shows preview and publish when no handlers are provided', async () => {
    const user = userEvent.setup()
    render(<AdvertisementEmptyState />)

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent('Zatím neinzerujete')
    expect(screen.getByRole('button', { name: 'Zobrazit náhled' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publikovat' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zobrazit náhled' }))
    await user.click(screen.getByRole('button', { name: 'Publikovat' }))
  })
})
