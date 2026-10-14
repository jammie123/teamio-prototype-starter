import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { JobResponseRateBadge } from './JobResponseRateBadge'
import type { JobResponseRateStatus } from './jobResponseRateCopy'

const meta = {
  id: 'jobs-jobresponseratebadge',
  title: 'Jobs/JobResponseRateBadge',
  component: JobResponseRateBadge,
  args: {
    status: 'expected',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['above', 'expected', 'below', 'tooEarly', 'noComparison'] satisfies JobResponseRateStatus[],
    },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-mb-[220px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobResponseRateBadge>

export default meta
type Story = StoryObj<typeof meta>

async function hoverAndExpectTitle(canvasElement: HTMLElement, title: string) {
  const canvas = within(canvasElement)
  await userEvent.hover(canvas.getByTestId('job-response-rate-badge-toggle'))
  await expect(await canvas.findByText(title)).toBeVisible()
}

export const Above: Story = {
  args: { status: 'above' },
  play: ({ canvasElement }) =>
    hoverAndExpectTitle(canvasElement, 'Míra odpovědí je vyšší než obvykle'),
}

export const Expected: Story = {
  args: { status: 'expected' },
  play: ({ canvasElement }) =>
    hoverAndExpectTitle(
      canvasElement,
      'Míra odpovědí je zhruba obvyklá',
    ),
}

export const Below: Story = {
  args: { status: 'below' },
  play: ({ canvasElement }) =>
    hoverAndExpectTitle(canvasElement, 'Míra odpovědí je nižší než obvykle'),
}

export const TooEarly: Story = {
  args: { status: 'tooEarly', showInconclusive: true },
  play: ({ canvasElement }) => hoverAndExpectTitle(canvasElement, 'Zatím nelze spolehlivě vyhodnotit'),
}

export const NoComparison: Story = {
  args: { status: 'noComparison', showInconclusive: true },
  play: ({ canvasElement }) =>
    hoverAndExpectTitle(canvasElement, 'Pro tuto pozici nemáme dost srovnatelných inzerátů'),
}

export const AllVariants: Story = {
  decorators: [
    (Story) => (
      <div className="tm-mb-0">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-3">
      <JobResponseRateBadge status="above" />
      <JobResponseRateBadge status="expected" />
      <JobResponseRateBadge status="below" />
      <JobResponseRateBadge status="tooEarly" showInconclusive />
      <JobResponseRateBadge status="noComparison" showInconclusive />
    </div>
  ),
}
