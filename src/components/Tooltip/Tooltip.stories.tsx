import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <div className="tm-p-16 tm-text-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Najeďte myší</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="tm-font-semibold">Více informací</div>
        <div>Zobrazí se tip k akci v náboru.</div>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Najeďte myší' })
    await userEvent.hover(trigger)
    const tooltip = await within(document.body).findByRole('tooltip')
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveTextContent('Více informací')
    await userEvent.unhover(trigger)
    trigger.focus()
    const focusedTooltip = await within(document.body).findByRole('tooltip')
    await expect(focusedTooltip).toBeVisible()
  },
}

export const Bottom: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Tip dole</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="tm-font-semibold">Stav uchazeče</div>
        <div>Poslední změna před 2 hodinami.</div>
      </TooltipContent>
    </Tooltip>
  ),
}
