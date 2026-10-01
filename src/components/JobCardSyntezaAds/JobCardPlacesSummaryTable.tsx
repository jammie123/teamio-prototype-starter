import { Button } from '../Button'
import {
  formatPublicationRange,
  partitionPublications,
} from '../JobCardSynteza/advertisementSummary'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobPublication } from '../JobCardSynteza/types'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'

export function shouldShowPlacesProlong(publications: JobPublication[], now = new Date()) {
  const { expired, endingSoon } = partitionPublications(publications, now)
  return expired.length > 0 || endingSoon.length > 0
}

export interface JobCardPlacesSummaryTableProps {
  publications: JobPublication[]
  showProlong?: boolean
  onExtend?: () => void
}

export function JobCardPlacesSummaryTable({
  publications,
  showProlong = false,
  onExtend,
}: JobCardPlacesSummaryTableProps) {
  return (
    <div
      data-testid="job-card-places-summary"
      className="tm-flex tm-w-max tm-max-w-[min(36rem,calc(100vw-2rem))] tm-flex-col tm-gap-2"
    >
      <Table
        data-testid="job-card-places-summary-table"
        className="!tm-w-auto tm-text-13"
      >
        <TableHead>
          <TableRow>
            <TableHeader className="tm-px-2 tm-py-1 tm-text-13 tm-font-medium">
              Název místa
            </TableHeader>
            <TableHeader className="tm-px-2 tm-py-1 tm-text-13 tm-font-medium tm-whitespace-nowrap">
              Vystavení
            </TableHeader>
            <TableHeader className="tm-px-2 tm-py-1 tm-text-13 tm-font-medium">
              Shlédnutí
            </TableHeader>
            <TableHeader className="tm-px-2 tm-py-1 tm-text-13 tm-font-medium">
              Reakcí
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {publications.map((publication) => (
            <TableRow key={publication.id} data-testid="job-card-places-summary-row">
              <TableCell className="tm-px-2 tm-py-1">
                <span className="tm-inline-flex tm-items-center tm-gap-1.5">
                  <JobPortalLogo
                    type={jobPortalLogoTypeFromChannel(publication.channel)}
                    title=""
                    className="tm-size-4"
                  />
                  <span className="tm-whitespace-nowrap tm-text-13 tm-font-medium tm-text-primary-default">
                    {publication.channel}
                  </span>
                </span>
              </TableCell>
              <TableCell className="tm-px-2 tm-py-1 tm-text-13 tm-tabular-nums tm-whitespace-nowrap tm-text-secondary-default">
                {formatPublicationRange(publication.startDate, publication.endDate)}
              </TableCell>
              <TableCell className="tm-px-2 tm-py-1 tm-text-right tm-text-13 tm-tabular-nums">
                {publication.viewCount === undefined ? '–' : formatCount(publication.viewCount)}
              </TableCell>
              <TableCell className="tm-px-2 tm-py-1 tm-text-right tm-text-13 tm-tabular-nums">
                {publication.reactionCount === undefined
                  ? '–'
                  : formatCount(publication.reactionCount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showProlong ? (
        <Button
          variant="secondary"
          size="small"
          data-testid="job-card-places-summary-extend"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onExtend?.()
          }}
        >
          Prodloužit
        </Button>
      ) : null}
    </div>
  )
}

JobCardPlacesSummaryTable.displayName = 'JobCardPlacesSummaryTable'
