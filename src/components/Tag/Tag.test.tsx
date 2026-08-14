import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders neutral color by default', () => {
    render(<Tag>Neutral</Tag>)
    const tag = screen.getByText('Neutral')
    expect(tag).toHaveClass(
      'tm-inline-flex',
      'tm-items-center',
      'tm-rounded-full',
      'tm-text-primary-inverted-default',
      'tm-bg-text-secondary-default',
    )
  })

  it('supports emotion colors and subtle variants', () => {
    const { rerender } = render(<Tag color="informative">Info</Tag>)
    expect(screen.getByText('Info')).toHaveClass(
      'tm-bg-emotion-info-active',
      'tm-text-primary-inverted-default',
    )

    rerender(
      <Tag color="success" isSubtle>
        Success
      </Tag>,
    )
    expect(screen.getByText('Success')).toHaveClass(
      'tm-text-emotion-success-emphasis',
      'tm-bg-emotion-success-background',
    )

    rerender(<Tag color="warning">Warn</Tag>)
    expect(screen.getByText('Warn')).toHaveClass('tm-bg-emotion-warning-hover')

    rerender(
      <Tag color="danger" isSubtle>
        Danger
      </Tag>,
    )
    expect(screen.getByText('Danger')).toHaveClass(
      'tm-text-emotion-danger-emphasis',
      'tm-bg-emotion-danger-background',
    )
  })

  it('supports optional dismiss with accessible label', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Tag onDismiss={onDismiss} dismissLabel="Odebrat štítek">
        Removable
      </Tag>,
    )
    await user.click(screen.getByRole('button', { name: 'Odebrat štítek' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
