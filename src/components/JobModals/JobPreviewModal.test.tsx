import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
import { JobPreviewModal } from './JobPreviewModal'
import { sampleJobPreviewPublications } from './jobPreviewFixtures'

const [pages, jobs, prace] = sampleJobPreviewPublications

function setup(props: Partial<React.ComponentProps<typeof JobPreviewModal>> = {}) {
  const renderPreview = vi.fn((publication: { name: string }) => (
    <p data-testid="preview">Náhled: {publication.name}</p>
  ))
  render(
    <JobPreviewModal
      defaultOpen
      jobTitle="Dohled nad IP službami"
      publications={sampleJobPreviewPublications}
      renderPreview={renderPreview}
      {...props}
    />,
  )
  return { renderPreview }
}

describe('JobPreviewModal', () => {
  it('renders title, close button, publications and URL of the first publication', async () => {
    setup()
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Dohled nad IP službami')
    expect(dialog).toHaveClass('tm-h-[95vh]', 'tm-w-[95vw]')
    expect(within(dialog).getByRole('button', { name: 'Zavřít náhled' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: pages.name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(dialog).getByRole('textbox', { name: 'Adresa inzerátu' })).toHaveValue(pages.url)
    expect(within(dialog).getByTestId('preview')).toHaveTextContent(`Náhled: ${pages.name}`)
  })

  it('activates another publication and re-renders the preview and URL', async () => {
    const user = userEvent.setup()
    const onActiveChange = vi.fn()
    setup({ onActiveChange })
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: jobs.name }))

    expect(within(dialog).getByRole('button', { name: jobs.name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(dialog).getByRole('button', { name: pages.name })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(within(dialog).getByRole('textbox', { name: 'Adresa inzerátu' })).toHaveValue(jobs.url)
    expect(within(dialog).getByTestId('preview')).toHaveTextContent(`Náhled: ${jobs.name}`)
    expect(onActiveChange).toHaveBeenCalledWith(jobs.id)
  })

  it('falls back to the first publication for an unknown active id', async () => {
    setup({ activeId: 'unknown' })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: pages.name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('respects defaultActiveId and controlled activeId', async () => {
    const { renderPreview } = setup({ defaultActiveId: prace.id })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: prace.name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(renderPreview).toHaveBeenCalledWith(prace)
  })

  it('does not change selection in controlled mode until activeId changes', async () => {
    const user = userEvent.setup()
    const onActiveChange = vi.fn()
    setup({ activeId: pages.id, onActiveChange })
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: jobs.name }))
    expect(onActiveChange).toHaveBeenCalledWith(jobs.id)
    expect(within(dialog).getByRole('button', { name: pages.name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('copies the active URL and shows feedback', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const onCopyUrl = vi.fn()
    setup({ onCopyUrl })
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: 'Zkopírovat odkaz' }))

    expect(writeText).toHaveBeenCalledWith(pages.url)
    expect(onCopyUrl).toHaveBeenCalledWith(pages.url)
    expect(await within(dialog).findByRole('button', { name: 'Zkopírováno' })).toBeInTheDocument()
  })

  it('calls onPrint', async () => {
    const user = userEvent.setup()
    const onPrint = vi.fn()
    setup({ onPrint })
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Tisk' }))
    expect(onPrint).toHaveBeenCalledTimes(1)
  })

  it('renders without list, URL and preview when there are no publications', async () => {
    const { renderPreview } = setup({ publications: [] })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByTestId('job-preview-publications-list')).not.toBeInTheDocument()
    expect(within(dialog).queryByTestId('job-preview-url-bar')).not.toBeInTheDocument()
    expect(renderPreview).not.toHaveBeenCalled()
  })

  it('closes from the close button', async () => {
    const user = userEvent.setup()
    render(
      <JobPreviewModal
        defaultOpen
        trigger={<Button>Otevřít</Button>}
        jobTitle="Pozice"
        publications={sampleJobPreviewPublications}
        renderPreview={() => <p>Náhled</p>}
      />,
    )
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Zavřít náhled' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
