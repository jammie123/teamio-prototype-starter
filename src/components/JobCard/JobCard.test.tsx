import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCard } from './JobCard'
import type { JobAdvertisement } from './types'

const advertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', viewCount: 130 },
  ],
}

function renderJobCard(props: Partial<Parameters<typeof JobCard>[0]> = {}) {
  return render(
    <JobCard
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      totalViewCount={1284}
      candidates={{ unreviewed: 14, inProgress: 6, total: 52 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCard', () => {
  it('renders title, owner and total views', () => {
    renderJobCard()

    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
    expect(screen.getByText('Petra Nováková')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-total-views').textContent).toMatch(/1\s284/)
  })

  it('renders the open status by default and the closed status on demand', () => {
    const { unmount } = renderJobCard()
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Otevřený')

    unmount()
    renderJobCard({ status: 'closed' })
    expect(screen.getByTestId('job-card-status')).toHaveTextContent('Uzavřený')
  })

  it('renders candidate counts with labels', () => {
    renderJobCard()

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('14Neposouzení')
    expect(stats).toHaveTextContent('6Ve hře')
    expect(stats).toHaveTextContent('52Uchazečů')
  })

  it('omits the stats block when no candidates are passed', () => {
    renderJobCard({ candidates: undefined })

    expect(screen.queryByTestId('job-card-stats')).not.toBeInTheDocument()
  })

  it('collapses and expands the advertisement section', async () => {
    const user = userEvent.setup()
    renderJobCard()

    const toggle = screen.getByRole('button', { name: 'Aktuální inzerát' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Jobs.cz')).toBeVisible()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Jobs.cz')).not.toBeVisible()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('hides publications above the limit behind a show more link', async () => {
    const user = userEvent.setup()
    renderJobCard()

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Zobrazit další 1 portál' }))
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Zobrazit méně' }))
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(2)
  })

  it('shows all publications without a link when publicationLimit is all', () => {
    renderJobCard({ publicationLimit: 'all' })

    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
    expect(screen.queryByRole('button', { name: /Zobrazit další/ })).not.toBeInTheDocument()
  })

  it('marks an expired publication with its end date', () => {
    renderJobCard({
      advertisements: [
        {
          id: 'ad-1',
          publications: [
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired',
              startDate: '12. 7.',
              endDate: '12. 8.',
            },
          ],
        },
      ],
    })

    const publication = screen.getByTestId('job-card-publication')
    expect(publication).toHaveTextContent('Ukončeno')
    expect(publication).toHaveTextContent('12. 7. – 12. 8.')
  })

  it('renders an empty state when the job has no advertisement', async () => {
    const user = userEvent.setup()
    const onCreateAdvertisement = vi.fn()
    renderJobCard({ advertisements: [], onCreateAdvertisement })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )

    await user.click(screen.getByRole('button', { name: 'Vytvořit inzerát' }))
    expect(onCreateAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit and the action from the dropdown menu', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    renderJobCard({
      onEdit,
      actions: [{ id: 'delete', label: 'Smazat nábor', color: 'danger', onClick: onDelete }],
    })

    await user.click(screen.getByRole('button', { name: 'Editovat' }))
    expect(onEdit).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTestId('job-card-actions-toggle'))
    await user.click(screen.getByRole('option', { name: 'Smazat nábor' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCard ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
