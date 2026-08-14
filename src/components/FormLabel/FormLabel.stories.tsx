import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormGroup } from '../FormGroup'
import { FormLabel } from './FormLabel'

const meta = {
  title: 'Components/FormLabel',
  component: FormLabel,
} satisfies Meta<typeof FormLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FormGroup>
      <FormLabel>Jméno uchazeče</FormLabel>
    </FormGroup>
  ),
}

export const Required: Story = {
  render: () => (
    <FormGroup isRequired>
      <FormLabel>Povinné pole</FormLabel>
    </FormGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormGroup isDisabled>
      <FormLabel>Zakázané pole</FormLabel>
    </FormGroup>
  ),
}
