import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobPreviewModal, type JobPreviewModalProps } from './JobPreviewModal'
import { sampleJobPreviewPublications, sampleJobPreviewTitle } from './jobPreviewFixtures'
import { SampleJobPreviewAdvertisement } from './SampleJobPreviewAdvertisement'

const meta = {
  id: 'jobs-jobmodals-previewmodal',
  title: 'Jobs/JobModals/JobPreviewModal',
  component: JobPreviewModal,
  args: {
    jobTitle: sampleJobPreviewTitle,
    publications: sampleJobPreviewPublications,
    onActiveChange: fn(),
    onCopyUrl: fn(),
    onPrint: fn(),
    renderPreview: (publication) => <SampleJobPreviewAdvertisement portalName={publication.name} />,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof JobPreviewModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Náhled inzerátu</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Náhled inzerátu' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName(sampleJobPreviewTitle)
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const SwitchPublication: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    const jobs = within(dialog).getByRole('button', { name: 'Jobs.cz' })
    await userEvent.click(jobs)
    await expect(jobs).toHaveAttribute('aria-pressed', 'true')
    await expect(within(dialog).getByRole('textbox', { name: 'Adresa inzerátu' })).toHaveValue(
      sampleJobPreviewPublications[1].url,
    )
  },
}

export const SinglePublication: Story = {
  args: {
    defaultOpen: true,
    publications: sampleJobPreviewPublications.slice(0, 1),
  },
}

function ControlledPreviewModal(props: JobPreviewModalProps) {
  const [activeId, setActiveId] = useState('prace')
  return <JobPreviewModal {...props} activeId={activeId} onActiveChange={setActiveId} />
}

export const ControlledActive: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => <ControlledPreviewModal {...args} />,
}
