import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'
import { Typography } from '../Typography'

const meta = {
  title: 'Components/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InContent: Story = {
  render: () => (
    <div className="tm-max-w-md">
      <Typography as="h3" variant="h4">
        Kontakt
      </Typography>
      <Typography>jana.novakova@firma.cz</Typography>
      <Divider className="tm-my-4" />
      <Typography as="h3" variant="h4">
        Poznámka
      </Typography>
      <Typography>Uchazečka preferuje hybridní režim.</Typography>
    </div>
  ),
}
