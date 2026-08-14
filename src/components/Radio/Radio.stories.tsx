import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Radio } from './Radio'

const meta = {
  title: 'Components/Radio',
  component: Radio,
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="tm-flex tm-flex-col tm-gap-2" role="radiogroup" aria-label="Velikost úvazku">
      <Radio name="size" value="s" defaultChecked>
        Malá
      </Radio>
      <Radio name="size" value="m">
        Střední
      </Radio>
      <Radio name="size" value="l">
        Velká
      </Radio>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const medium = canvas.getByRole('radio', { name: 'Střední' })
    await userEvent.click(medium)
    await expect(medium).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Malá' })).not.toBeChecked()
  },
}

export const Error: Story = {
  args: {
    name: 'error',
    value: '1',
    validationState: 'error',
    children: 'Chybná volba',
  },
}

export const Disabled: Story = {
  args: {
    name: 'disabled',
    value: '1',
    disabled: true,
    children: 'Nedostupná volba',
  },
}
