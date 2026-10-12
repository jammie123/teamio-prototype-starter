import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { TableHead, TableHeader, TableRow } from '../Table'
import {
  candidateHeaderPaddingClass,
  candidateHeaderTextClass,
  candidateNameColumnClass,
  candidateNoteColumnClass,
} from './candidateCellClass'
import { CANDIDATE_COPY } from './candidateCopy'

export type CandidateTableHeadProps = StyleProps

/** Header row matching the columns of `CandidateItem`, with the same sticky name and note columns. */
export function CandidateTableHead({ className }: CandidateTableHeadProps) {
  const { columns } = CANDIDATE_COPY
  const stickyHeader = 'tm-bg-cover-light tm-z-20'
  const headerClass = cn(candidateHeaderPaddingClass, candidateHeaderTextClass)

  return (
    <TableHead className={className}>
      <TableRow>
        <TableHeader className={cn(headerClass, candidateNameColumnClass, stickyHeader)}>
          {columns.name}
        </TableHeader>
        <TableHeader className={headerClass}>{columns.rating}</TableHeader>
        <TableHeader className={headerClass}>{columns.attachments}</TableHeader>
        <TableHeader className={headerClass}>{columns.ai}</TableHeader>
        <TableHeader className={headerClass}>{columns.status}</TableHeader>
        <TableHeader className={headerClass}>{columns.lastContact}</TableHeader>
        <TableHeader className={headerClass}>{columns.source}</TableHeader>
        <TableHeader className={headerClass}>{columns.tags}</TableHeader>
        <TableHeader className={cn(headerClass, candidateNoteColumnClass, stickyHeader)}>
          {columns.note}
        </TableHeader>
      </TableRow>
    </TableHead>
  )
}

CandidateTableHead.displayName = 'CandidateTableHead'
