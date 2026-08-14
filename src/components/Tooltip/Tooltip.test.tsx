import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Button } from '../Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

describe('Tooltip', () => {
  it('shows accessible tooltip content on hover via asChild trigger', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Více informací</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await user.hover(screen.getByRole('button', { name: 'Hover me' }))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Více informací')
    })
    expect(screen.getByRole('tooltip')).toHaveClass(
      'tm-bg-inverted',
      'tm-text-primary-inverted-default',
      'tm-rounded',
      'tm-text-sm',
    )
  })

  it('uses source-faithful width and no extra shadow on the popover', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Šířka</Button>
          </TooltipTrigger>
          <TooltipContent>Popover</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await user.hover(screen.getByRole('button', { name: 'Šířka' }))
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveClass('tm-max-w-full')
    expect(tooltip).not.toHaveClass('tm-max-w-xs', 'tm-shadow-xs')
  })

  it('renders an arrow styled to match the dark tooltip surface', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Šipka</Button>
          </TooltipTrigger>
          <TooltipContent>S šipkou</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await user.hover(screen.getByRole('button', { name: 'Šipka' }))
    const tooltip = await screen.findByRole('tooltip')
    const arrow = tooltip.querySelector('svg')
    expect(arrow).not.toBeNull()
    expect(arrow).toHaveClass('tm-fill-teamio-dark')
  })

  it('shows tooltip content on focus for keyboard users', async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Focus me</Button>
          </TooltipTrigger>
          <TooltipContent>Klávesnice tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    await user.tab()
    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus()
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Klávesnice tip')
    })
  })
})
