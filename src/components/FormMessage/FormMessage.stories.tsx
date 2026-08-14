import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormGroup } from '../FormGroup'
import { FormMessage } from './FormMessage'

const meta = {
  title: 'Components/FormMessage',
  component: FormMessage,
} satisfies Meta<typeof FormMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FormGroup>
      <FormMessage>Pomocný text pod polem formuláře.</FormMessage>
    </FormGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Success: Story = {
  render: () => (
    <FormGroup validationState="success">
      <FormMessage>Údaje jsou v pořádku.</FormMessage>
    </FormGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Warning: Story = {
  render: () => (
    <FormGroup validationState="warning">
      <FormMessage>Zkontrolujte zadanou hodnotu.</FormMessage>
    </FormGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
}

export const Error: Story = {
  render: () => (
    <FormGroup validationState="error">
      <FormMessage>Chybová zpráva u pole.</FormMessage>
    </FormGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
}
