import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobAssignee } from './JobAssignee'

const meta = {
  title: 'Jobs/Job Cards Variant/JobCardV14/JobAssignee',
  component: JobAssignee,
  args: {
    owner: 'Petra Nováková',
    hiringManagers: ['Lukáš Procházka'],
    onInviteMore: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-min-h-40 tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobAssignee>

export default meta
type Story = StoryObj<typeof meta>

export const OwnerAndManager: Story = {
  name: 'Náborář a hiring manager',
}

export const OnlyOwner: Story = {
  name: 'Jen náborář',
  args: { hiringManagers: [] },
}

export const ManyManagers: Story = {
  name: 'Více hiring managerů',
  args: { hiringManagers: ['Lukáš Procházka', 'Jana Svobodová', 'Tomáš Král'] },
}

export const WithoutInvite: Story = {
  name: 'Bez tlačítka Upravit zapojení',
  args: { onInviteMore: undefined },
}
