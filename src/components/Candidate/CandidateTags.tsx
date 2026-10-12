import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Tag } from '../Tag'
import { CANDIDATE_COPY } from './candidateCopy'
import type { CandidateTagData } from './types'

export interface CandidateTagsProps extends StyleProps {
  tags?: CandidateTagData[]
  onAdd?: () => void
  onRemove?: (tag: CandidateTagData) => void
}

export function CandidateTags({ tags = [], onAdd, onRemove, className }: CandidateTagsProps) {
  return (
    <div
      data-testid="candidate-tags"
      className={cn('tm-flex', 'tm-flex-wrap', 'tm-items-center', 'tm-gap-1.5', className)}
    >
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          isSubtle
          data-testid="candidate-tag"
          dismissLabel={CANDIDATE_COPY.removeTag(tag.label)}
          onDismiss={onRemove ? () => onRemove(tag) : undefined}
        >
          {tag.label}
        </Tag>
      ))}
      {onAdd ? (
        <Button
          variant="tertiary"
          size="small"
          data-testid="candidate-tags-add"
          onClick={onAdd}
          className="!tm-font-medium tm-text-secondary-default"
        >
          <Icon name={tags.length === 0 ? 'tag' : 'plus'} className="tm-text-base" />
          {CANDIDATE_COPY.addTag}
        </Button>
      ) : null}
    </div>
  )
}

CandidateTags.displayName = 'CandidateTags'
