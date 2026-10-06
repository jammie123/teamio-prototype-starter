import { Button } from '../Button'
import {
  formatPublicationRange,
  partitionPublications,
  visibleHighlights,
} from '../JobCardSynteza/advertisementSummary'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobPublication, JobPublicationHighlight } from '../JobCardSynteza/types'
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

function placeRows(publications: JobPublication[]) {
  return publications.flatMap((publication) => [
    { key: publication.id, publication, highlight: undefined as JobPublicationHighlight | undefined },
    ...visibleHighlights(publication).map((highlight) => ({
      key: highlight.id,
      publication,
      highlight,
    })),
  ])
}

export function JobCardPlacesSummaryTable({
  publications,
  showProlong = false,
  onExtend,
}: JobCardPlacesSummaryTableProps) {
  const rows = placeRows(publications)

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
          {rows.map(({ key, publication, highlight }) => {
            const name = highlight?.name ?? publication.channel
            const startDate = highlight?.startDate ?? publication.startDate
            const endDate = highlight?.endDate ?? publication.endDate
            const viewCount = highlight ? highlight.viewCount : publication.viewCount
            const reactionCount = highlight ? highlight.reactionCount : publication.reactionCount

            return (
              <TableRow
                key={key}
                data-testid={
                  highlight ? 'job-card-places-summary-highlight-row' : 'job-card-places-summary-row'
                }
              >
                <TableCell className="tm-px-2 tm-py-1">
                  <span className="tm-inline-flex tm-items-center tm-gap-1.5">
                    {highlight ? null : (
                      <JobPortalLogo
                        type={jobPortalLogoTypeFromChannel(publication.channel)}
                        title=""
                        className="tm-size-4"
                      />
                    )}
                    <span
                      className={
                        highlight
                          ? 'tm-whitespace-nowrap tm-text-13 tm-font-medium tm-text-teamio-pink'
                          : 'tm-whitespace-nowrap tm-text-13 tm-font-medium tm-text-primary-default'
                      }
                    >
                      {name}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="tm-px-2 tm-py-1 tm-text-13 tm-tabular-nums tm-whitespace-nowrap tm-text-secondary-default">
                  {formatPublicationRange(startDate, endDate)}
                </TableCell>
                <TableCell className="tm-px-2 tm-py-1 tm-text-right tm-text-13 tm-tabular-nums">
                  {viewCount === undefined ? '–' : formatCount(viewCount)}
                </TableCell>
                <TableCell className="tm-px-2 tm-py-1 tm-text-right tm-text-13 tm-tabular-nums">
                  {reactionCount === undefined ? '–' : formatCount(reactionCount)}
                </TableCell>
              </TableRow>
            )
          })}
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
