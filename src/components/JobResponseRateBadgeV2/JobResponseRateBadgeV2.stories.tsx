import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { JobResponseRateStatus } from '../JobResponseRateBadge/jobResponseRateCopy'
import { JobResponseRateBadgeV2 } from './JobResponseRateBadgeV2'

const meta = {
  id: 'jobs-jobresponseratebadge-v2',
  title: 'Jobs/JobResponseRateBadge/V2',
  component: JobResponseRateBadgeV2,
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
      <div className="tm-mb-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobResponseRateBadgeV2>

export default meta
type Story = StoryObj<typeof meta>

async function hoverAndExpectBubble(canvasElement: HTMLElement, title: string, value: string) {
  const canvas = within(canvasElement)
  await userEvent.hover(canvas.getByTestId('job-response-rate-badge-v2-toggle'))
  await expect(await canvas.findByText(title)).toBeVisible()
  await expect(canvas.getByTestId('job-response-rate-badge-v2-bubble-value')).toHaveTextContent(value)
}

export const Above: Story = {
  args: { status: 'above' },
  play: ({ canvasElement }) =>
    hoverAndExpectBubble(canvasElement, 'Míra odpovědí je vyšší než obvykle', '5,2 %'),
}

export const Expected: Story = {
  args: { status: 'expected' },
  play: ({ canvasElement }) =>
    hoverAndExpectBubble(canvasElement, 'Míra odpovědí je zhruba obvyklá', '3,4 %'),
}

export const Below: Story = {
  args: { status: 'below' },
  play: ({ canvasElement }) =>
    hoverAndExpectBubble(canvasElement, 'Míra odpovědí je nižší než obvykle', '1,1 %'),
}

/** Rates close to a band edge keep the bubble inside the chart. */
export const ExpectedNearLowerBound: Story = {
  args: { status: 'expected', responses: 26, views: 1000 },
}

export const BelowNearZero: Story = {
  args: { status: 'below', responses: 2, views: 1000 },
}

export const AboveFarOut: Story = {
  args: { status: 'above', responses: 120, views: 830 },
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
      <JobResponseRateBadgeV2 status="above" />
      <JobResponseRateBadgeV2 status="expected" />
      <JobResponseRateBadgeV2 status="below" />
      <JobResponseRateBadgeV2 status="tooEarly" showInconclusive />
      <JobResponseRateBadgeV2 status="noComparison" showInconclusive />
    </div>
  ),
}
