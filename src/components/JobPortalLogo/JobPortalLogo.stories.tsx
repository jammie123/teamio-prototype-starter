import type { Meta, StoryObj } from '@storybook/react-vite'
import { JOB_PORTAL_LOGO_TYPES, JobPortalLogo } from './JobPortalLogo'

const meta = {
  title: 'Components/JobPortalLogo',
  component: JobPortalLogo,
  args: {
    type: 'jobs-cz',
  },
} satisfies Meta<typeof JobPortalLogo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllTypes: Story = {
  render: () => (
    <div className="tm-flex tm-flex-wrap tm-items-end tm-gap-4">
      {JOB_PORTAL_LOGO_TYPES.map((type) => (
        <div key={type} className="tm-flex tm-w-28 tm-flex-col tm-items-center tm-gap-2">
          <JobPortalLogo type={type} className="tm-size-[50px]" />
          <span className="tm-text-center tm-text-xs tm-text-secondary-default">{type}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="tm-flex tm-items-end tm-gap-4">
      <JobPortalLogo type="jobs-cz" className="tm-size-4" />
      <JobPortalLogo type="jobs-cz" />
      <JobPortalLogo type="jobs-cz" className="tm-size-8" />
      <JobPortalLogo type="jobs-cz" className="tm-size-[50px]" />
    </div>
  ),
}

export const Fallback: Story = {
  args: {
    type: 'unknown-portal',
    title: 'Neznámý portál',
  },
}
