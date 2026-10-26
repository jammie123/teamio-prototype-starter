import { useState } from 'react'
import { cn } from '../../lib/cn'
import { JobCardAdvertisementSwitcher } from '../JobCardSynteza/JobCardAdvertisementSwitcher'
import { advertisementSwitcherTitle } from '../JobCardSyntezaAds/advertisementSummaryAds'
import type { JobAdvertisement, JobPublication } from '../JobCardSyntezaPipeline/types'
import { JobCardAdvertisementSimplify24Panel } from './JobCardAdvertisementSimplify24Panel'
import { JOB_CARD_SIMPLIFY_24_SECTION_PADDING } from './constants'

export interface JobCardSimplify24AdvertisementSectionProps {
  advertisements: JobAdvertisement[]
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendAndRepublish?: () => void
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onDeclineAdvertising?: () => void
  onRepublishAdvertisement?: () => void
  onEditAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

export function JobCardSimplify24AdvertisementSection({
  advertisements,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendAndRepublish,
  onCompleteAdvertisement,
  onDeclineAdvertising,
  onRepublishAdvertisement,
  onEditAdvertisement,
  onCreateAdvertisement,
}: JobCardSimplify24AdvertisementSectionProps) {
  const [selectedAdIndex, setSelectedAdIndex] = useState(0)

  const selectedAdvertisement = advertisements[selectedAdIndex]
  const hasSwitcher = advertisements.length > 1

  const panelProps = {
    onCompleteAdvertisement,
    onViewStatisticsClick,
    onPreviewAdvertisement,
    onPreviewPublication,
    onExtendPublication,
    onExtendPublications: onExtendAndRepublish,
    onRepublishAdvertisement,
    onDeclineAdvertising,
    onEditAdvertisement,
    onCreateAdvertisement,
  }

  return (
    <div
      data-testid="job-card-advertisements"
      className={cn(
        'tm-relative tm-w-full tm-min-w-0 tm-overflow-visible md:tm-w-2/5 md:tm-flex-none md:tm-self-stretch md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary',
        JOB_CARD_SIMPLIFY_24_SECTION_PADDING,
      )}
    >
      {advertisements.length === 0 ? (
        <JobCardAdvertisementSimplify24Panel
          advertisement={{
            id: 'no-ad',
            status: 'notAdvertising',
            publications: [],
          }}
          {...panelProps}
        />
      ) : selectedAdvertisement ? (
        <div className="tm-flex tm-flex-col tm-gap-2">
          {hasSwitcher ? (
            <JobCardAdvertisementSwitcher
              title={advertisementSwitcherTitle(selectedAdvertisement, selectedAdIndex)}
              index={selectedAdIndex}
              total={advertisements.length}
              onPrev={() =>
                setSelectedAdIndex((current) =>
                  current === 0 ? advertisements.length - 1 : current - 1,
                )
              }
              onNext={() =>
                setSelectedAdIndex((current) =>
                  current === advertisements.length - 1 ? 0 : current + 1,
                )
              }
            />
          ) : null}
          <JobCardAdvertisementSimplify24Panel
            key={selectedAdvertisement.id}
            advertisement={selectedAdvertisement}
            {...panelProps}
          />
        </div>
      ) : null}
    </div>
  )
}

JobCardSimplify24AdvertisementSection.displayName = 'JobCardSimplify24AdvertisementSection'
