import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { JobAssigneePeople } from './JobAssigneePeople'

const meta = {
  title: 'Jobs/JobAssigneePeople',
  component: JobAssigneePeople,
  args: {
    owner: 'Petra Nováková',
    hiringManagers: [],
    onInviteMore: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-min-h-40 tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobAssigneePeople>

export default meta
type Story = StoryObj<typeof meta>

export const OnlyOwner: Story = {
  name: 'Jen vlastník',
  args: { hiringManagers: [] },
}

export const OwnerAndHiringManager: Story = {
  name: 'Vlastník a hiring manažer',
  args: { hiringManagers: ['Lukáš Procházka'] },
}

export const OwnerAndMoreThanFourInvolved: Story = {
  name: 'Vlastník a více než 4 zapojení (3 avatary + +4)',
  args: {
    hiringManagers: [
      'Lukáš Procházka',
      'Jana Svobodová',
      'Tomáš Král',
      'Eva Dvořáková',
      'Martin Veselý',
      'Klára Horáková',
    ],
  },
}
