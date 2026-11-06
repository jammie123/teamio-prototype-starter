import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvertisementAction } from './AdvertisementAction'
import { formatCount } from './lib/format'

describe('AdvertisementAction', () => {
  it('shows statistics, Detail and Náhled when the advertisement is running', () => {
    render(<AdvertisementAction viewCount={2610} onStatistics={vi.fn()} onDetail={vi.fn()} onPreview={vi.fn()} />)

    const root = screen.getByTestId('job-card-advertisement-action')
    const items = [...root.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    const statistics = screen.getByTestId('job-card-advertisement-aggregate-views')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')
    const preview = screen.getByTestId('job-card-advertisement-preview-action')
    expect(statistics.className).toContain('tm-font-normal')
    expect(statistics.className).not.toContain('tm-font-medium')
    expect(statistics).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(within(statistics).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    for (const action of [statistics, preview]) {
      expect(action.className).not.toMatch(/(?:^|\s)tm-h-/)
      expect(action.className).not.toMatch(/(?:^|\s)tm-min-h-/)
      expect(action.className).toContain('tm-text-action-link-secondary-default')
      const iconSvg = within(action).getByTestId('icon').querySelector('svg')
      expect(iconSvg).toHaveStyle({ width: '20px', height: '20px' })
    }
    expect(detail).toHaveTextContent('Zobrazit detail')
    expect(detail.className).toContain('tm-text-secondary-default')
    expect(detail.className).toContain('tm-font-normal')
    expect(detail.className).not.toContain('tm-font-medium')
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toHaveAccessibleName(
      'Zobrazit detail inzerce',
    )
    expect(preview).toHaveTextContent('Náhled')
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.getAllByRole('separator', { hidden: true })).toHaveLength(2)
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
      'job-card-advertisement-preview-action',
    ])
  })

  it('adds Prodloužit before Náhled when the advertisement is ending soon', () => {
    render(
      <AdvertisementAction
        viewCount={2610}
        showProlong
        onDetail={vi.fn()}
        onProlong={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    const root = screen.getByTestId('job-card-advertisement-action')
    const items = [...root.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    expect(screen.getByTestId('job-card-disappearance-prolong')).toHaveTextContent('Prodloužit')
    expect(screen.getByTestId('job-card-disappearance-prolong').className).toContain(
      'tm-min-w-[100px]',
    )
    expect(screen.getAllByRole('separator', { hidden: true })).toHaveLength(3)
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
      'job-card-disappearance-prolong',
      'job-card-advertisement-preview-action',
    ])
  })

  it('hides statistics when viewCount is missing', () => {
    render(<AdvertisementAction onDetail={vi.fn()} onPreview={vi.fn()} />)

    expect(screen.queryByTestId('job-card-advertisement-aggregate-views')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-detail-action')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-preview-action')).toBeInTheDocument()
  })

  it('calls handlers when actions are clicked', async () => {
    const user = userEvent.setup()
    const onStatistics = vi.fn()
    const onDetail = vi.fn()
    const onProlong = vi.fn()
    const onPreview = vi.fn()

    render(
      <AdvertisementAction
        viewCount={100}
        showProlong
        onStatistics={onStatistics}
        onDetail={onDetail}
        onProlong={onProlong}
        onPreview={onPreview}
      />,
    )

    await user.click(screen.getByTestId('job-card-advertisement-aggregate-views'))
    await user.click(screen.getByTestId('job-card-advertisement-detail-action'))
    await user.click(screen.getByTestId('job-card-disappearance-prolong'))
    await user.click(screen.getByTestId('job-card-advertisement-preview-action'))

    expect(onStatistics).toHaveBeenCalledOnce()
    expect(onDetail).toHaveBeenCalledOnce()
    expect(onProlong).toHaveBeenCalledOnce()
    expect(onPreview).toHaveBeenCalledOnce()
  })

  it('renders an inline stats + Detail row separated by a divider', () => {
    render(
      <AdvertisementAction
        layout="inline"
        viewCount={2610}
        showProlong
        onStatistics={vi.fn()}
        onDetail={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    const root = screen.getByTestId('job-card-advertisement-action')
    const statistics = screen.getByTestId('job-card-advertisement-aggregate-views')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')
    const items = [...root.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    expect(root).toHaveAttribute('data-layout', 'inline')
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
    ])
    expect(screen.queryByTestId('job-card-advertisement-preview-action')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
    expect(screen.getAllByRole('separator', { hidden: true })).toHaveLength(1)
    expect(statistics).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(detail).toHaveTextContent('Zobrazit detail')
    expect(detail).toHaveAccessibleName('Zobrazit detail inzerce')
    expect(statistics.className).toContain('tm-text-secondary-default')
    expect(detail.className).toContain('tm-text-secondary-default')
    expect(detail.className).not.toContain('tm-text-action-link-default')
    expect(root.className).toContain('hover:tm-bg-interactive-hover')
    expect(statistics.className).not.toContain('hover:tm-bg-interactive-hover')
    expect(detail.className).not.toContain('hover:tm-bg-interactive-hover')

    const divider = screen.getByRole('separator', { hidden: true })
    expect(divider.className).toContain('tm-self-center')
    expect(divider.className).not.toContain('tm-self-stretch')

    for (const action of [statistics, detail]) {
      expect(action.className).toContain('tm-flex-row')
      expect(action.className).not.toMatch(/(?:^|\s)tm-h-/)
      expect(action.className).not.toMatch(/(?:^|\s)tm-min-h-/)
    }

    const statisticsIcon = within(statistics).getByTestId('icon')
    expect(statisticsIcon).toHaveAttribute('data-icon-name', 'eye')
    expect(statistics.firstElementChild).toBe(statisticsIcon)
    expect(within(detail).queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('renders a column with stats above Detail o inzerci', () => {
    render(
      <AdvertisementAction
        layout="column"
        viewCount={2610}
        onStatistics={vi.fn()}
        onDetail={vi.fn()}
        onPreview={vi.fn()}
      />,
    )

    const root = screen.getByTestId('job-card-advertisement-action')
    const main = screen.getByTestId('job-card-advertisement-action-main')
    const statistics = screen.getByTestId('job-card-advertisement-aggregate-views')
    const detail = screen.getByTestId('job-card-advertisement-detail-action')
    const items = [...main.children]
      .map((item) => item.getAttribute('data-testid'))
      .filter((id): id is string => Boolean(id))

    expect(root).toHaveAttribute('data-layout', 'column')
    expect(main.className).toContain('tm-flex-col')
    expect(main.className).toContain('hover:tm-bg-interactive-hover')
    expect(items).toEqual([
      'job-card-advertisement-aggregate-views',
      'job-card-advertisement-detail-action',
    ])
    expect(screen.queryByRole('separator', { hidden: true })).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-preview-action')).not.toBeInTheDocument()
    expect(statistics).toHaveAccessibleName(`${formatCount(2610)} zhlédnutí`)
    expect(statistics.className).toContain('tm-text-secondary-default')
    expect(within(statistics).getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')
    expect(statistics.firstElementChild).toBe(within(statistics).getByTestId('icon'))
    expect(detail).toHaveTextContent('Zobrazit detail')
    expect(detail).toHaveAccessibleName('Zobrazit detail inzerce')
    expect(detail.className).toContain('tm-text-secondary-default')
    expect(within(detail).queryByTestId('icon')).not.toBeInTheDocument()
    expect(
      statistics.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })

  it('shows Prodloužit in the column layout when showProlong is true', async () => {
    const user = userEvent.setup()
    const onProlong = vi.fn()

    render(
      <AdvertisementAction
        layout="column"
        viewCount={2610}
        showProlong
        onStatistics={vi.fn()}
        onDetail={vi.fn()}
        onProlong={onProlong}
      />,
    )

    const root = screen.getByTestId('job-card-advertisement-action')
    const prolong = screen.getByTestId('job-card-disappearance-prolong')

    expect(prolong).toHaveTextContent('Prodloužit')
    expect(prolong.className).toContain('tm-min-w-[100px]')
    expect(prolong.tagName).toBe('BUTTON')
    expect(within(prolong).queryByTestId('icon')).not.toBeInTheDocument()
    expect(root.firstElementChild).toBe(prolong)
    expect(
      prolong.compareDocumentPosition(screen.getByTestId('job-card-advertisement-action-main')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    await user.click(prolong)
    expect(onProlong).toHaveBeenCalledOnce()
  })

  it('hides Prodloužit in the column layout when showProlong is false', () => {
    render(
      <AdvertisementAction layout="column" viewCount={2610} showProlong={false} onDetail={vi.fn()} />,
    )

    expect(screen.queryByTestId('job-card-disappearance-prolong')).not.toBeInTheDocument()
  })
})
